import { addDays, endOfDay, formatRFC3339, startOfDay, subDays } from 'date-fns';
import type { z } from 'zod';

import aggregator from '../_lib/aggregate.ts';
import { createNotification } from '../_lib/notification.ts';
import { createResend } from '../_lib/resend.ts';
import { makeErrorResponse, makeSuccessResponse } from '../_lib/response.ts';
import type { responseDataSchema } from '../_lib/smartgrid.ts';
import { createSmartGrid } from '../_lib/smartgrid.ts';
import { createSupabase } from '../_lib/supabase.ts';

type SmartGridResponse = z.infer<typeof responseDataSchema>[];

const smartgrid = createSmartGrid();
const resend = createResend(Deno.env.get('RESEND_API_KEY')!);
const supabase = createSupabase({
  url: Deno.env.get('SUPABASE_URL')!,
  key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
});
const notification = createNotification({ from: Deno.env.get('RESEND_FROM')!, resend, supabase });

const constructHtml = (action: 'crossover' | 'crossunder', message?: string | null) => {
  return `<!DOCTYPE html>
  <html>
  The electricity in Ireland has just entered ${
    action === 'crossover' ? 'high-demand' : 'low-demand'
  } period. Consider using ${action === 'crossover' ? 'less' : 'more'} electricity now.

  ${message ? `You custom message: ${message}` : ''}
  
  <br />
  <em>It is encouraged to use more electricity during the <strong>low-demand period</strong> to save electricity cost.</em>
  </html>`;
};

Deno.serve(async () => {
  console.log('Running realtime alert');

  const { data: _prevDemand, error: prevDemandError } = await supabase
    .from('realtime_system_demand')
    .select('value')
    .order('event_time', { ascending: false })
    .limit(1);
  if (prevDemandError) {
    console.error(prevDemandError);
    console.error('Skipping due to failed to fetch realtime_system_demand');
    return makeErrorResponse(prevDemandError);
  }
  const prevDemand = _prevDemand.length > 0 ? _prevDemand[0].value : 0;

  const { data, error } = await supabase
    .from('alert')
    .select('*')
    .eq('active', true)
    .eq('alert_type', 'realtime');
  if (error) {
    console.error(error);
    console.error('Exiting due to error');
    return makeErrorResponse(error);
  }

  const regions = [...new Set(data.map(({ region }) => region))];

  for (const region of regions) {
    try {
      const from = startOfDay(subDays(new Date(), 7));
      const to = endOfDay(addDays(new Date(), 7));
      console.log(
        `Fetching net demand from ${formatRFC3339(from)} to ${formatRFC3339(to)} for `,
        region,
      );

      const constructParams = (type: 'actual' | 'forecast') => ({ region, type, from, to });
      const demandActual = (await smartgrid.demand(constructParams('actual'))) as SmartGridResponse;
      if (demandActual.length < 1) {
        console.error(`EirGrid is not giving actual system demand`);
        return makeErrorResponse(new Error(`EirGrid is not giving actual system demand`));
      }
      const _currentDemand = demandActual.findLast((d) => !!d.Value);
      const currentDemand = _currentDemand?.Value;
      if (!currentDemand) {
        console.error(`getting null values for actual system demand`);
        return makeErrorResponse(new Error(`getting null values for actual system demand`));
      }

      const { error: insertSystemDemandError } = await supabase
        .from('realtime_system_demand')
        .upsert({ event_time: _currentDemand.EffectiveTime, value: currentDemand });
      if (insertSystemDemandError) {
        console.error(`Failed to insert currentDemand into database: `, insertSystemDemandError);
        return makeErrorResponse(
          new Error(`Failed to insert currentDemand into database: ${insertSystemDemandError}`),
        );
      }

      const averageNetDemand = aggregator.average(
        aggregator
          .netDemand({
            demand: {
              actual: demandActual,
              forecast: (await smartgrid.demand(constructParams('forecast'))) as SmartGridResponse,
            },
            wind: {
              actual: (await smartgrid.wind(constructParams('actual'))) as SmartGridResponse,
              forecast: (await smartgrid.wind(constructParams('forecast'))) as SmartGridResponse,
            },
          })
          .map(({ value }) => value),
      );
      console.log(`The previous demand is `, prevDemand);
      console.log(`The current demand is `, currentDemand);
      console.log(`The average net demand is `, averageNetDemand);

      const action =
        prevDemand < averageNetDemand && currentDemand >= averageNetDemand
          ? 'crossover'
          : prevDemand > averageNetDemand && currentDemand <= averageNetDemand
            ? 'crossunder'
            : 'none';

      switch (action) {
        case 'crossover':
        case 'crossunder':
          console.log(`Demand has ${action} the averageNetDemand.`);
          for (const alert of data.filter(({ region: r }) => r === region)) {
            console.log(`Getting user ${alert.user_id} from supabase`);
            const { data, error } = await supabase.auth.admin.getUserById(alert.user_id);
            if (error) {
              console.error(error);
              console.error('Skipping due to failed to fetch user');
              continue;
            }
            if (!data.user.email) {
              console.error('Skipping due to user email not found');
              continue;
            }

            await notification.sendEmail({
              to: data.user.email,
              subject: `📢 SmartGrid: Electricity in Ireland has just entered ${
                action === 'crossover' ? 'high-demand' : 'low-demand'
              } period`,
              html: constructHtml(action, alert.message),
            });
          }
          break;
        case 'none':
          console.log('Demand has not crossover or crossunder yet.');
          break;
      }
    } catch (err) {
      console.error(err);
      console.error('Exiting due to failed to fetch realtime');
      return makeErrorResponse(err);
    }
  }

  return makeSuccessResponse({});
});
