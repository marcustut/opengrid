import {
  addDays,
  endOfDay,
  format,
  formatRFC3339,
  isEqual,
  isToday,
  startOfDay,
  subDays,
  subMinutes,
} from 'date-fns';
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

const constructHtml = (
  aboveDateRange: { from: Date; to: Date }[],
  belowDateRange: { from: Date; to: Date }[],
  message?: string | null,
) => {
  return `<!DOCTYPE html>
  <html>
  The forecasted time are as follows: <br /><br />

  ${
    belowDateRange.length === 0 && aboveDateRange.length === 0
      ? 'The electricity demand remains the same for the entire day, no high-demand and low-demand period'
      : ''
  }
  
  ${
    belowDateRange.length > 0
      ? `<strong>Low-demand period:</strong><br />
        <ul>
            ${belowDateRange.map(
              ({ from, to }) => `<li>${formatRFC3339(from)} - ${formatRFC3339(to)}</li>`,
            )}
        </ul>`
      : 'No low-demand period today'
  }
  
  ${
    aboveDateRange.length > 0
      ? `<strong>High-demand period:</strong><br />
        <ul>
            ${aboveDateRange.map(
              ({ from, to }) => `<li>${formatRFC3339(from)} - ${formatRFC3339(to)}</li>`,
            )}
        </ul>`
      : 'No high-demand period today'
  }

  ${message ? `You custom message: ${message}` : ''}
  
  <br />
  <em>It is encouraged to use more electricity during the <strong>low-demand period</strong> to save electricity cost.</em>
  </html>`;
};

Deno.serve(async () => {
  console.log('Running daily alert');

  const { data, error } = await supabase
    .from('alert')
    .select('*')
    .eq('active', true)
    .eq('alert_type', 'daily');
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
      const demandForecast = (await smartgrid.demand(
        constructParams('forecast'),
      )) as SmartGridResponse;
      let demands = [] as SmartGridResponse;
      if (demandForecast.every((x) => !x.Value)) {
        console.error(`EirGrid is returning null for forecasted values, using actual values`);
        demands = demandActual;
      } else demands = demandForecast;

      const averageNetDemand = aggregator.average(
        aggregator
          .netDemand({
            demand: { actual: demandActual, forecast: demandForecast },
            wind: {
              actual: (await smartgrid.wind(constructParams('actual'))) as SmartGridResponse,
              forecast: (await smartgrid.wind(constructParams('forecast'))) as SmartGridResponse,
            },
          })
          .map(({ value }) => value),
      );
      console.log(`The average net demand is `, averageNetDemand);

      const aboveTimeframe: Date[] = [];
      const belowTimeframe: Date[] = [];

      demands
        .filter((x) => isToday(x.EffectiveTime))
        .forEach((x) => {
          if (!x.Value) return;
          if (x.Value >= averageNetDemand) aboveTimeframe.push(x.EffectiveTime);
          else belowTimeframe.push(x.EffectiveTime);
        });

      const aboveDateRange = aggregator.toDateRange(aboveTimeframe, (a, b) =>
        isEqual(subMinutes(b, 15), a),
      );
      const belowDateRange = aggregator.toDateRange(belowTimeframe, (a, b) =>
        isEqual(subMinutes(b, 15), a),
      );
      console.log('aboveDateRange', aboveDateRange);
      console.log('belowDateRange', belowDateRange);

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
          subject: `SmartGrid Electricity Reminder for ${format(new Date(), 'dd/MM/yyyy')}`,
          html: constructHtml(aboveDateRange, belowDateRange, alert.message),
        });
      }
    } catch (err) {
      console.error(err);
      console.error('Exiting due to failed to fetch daily');
      return makeErrorResponse(err);
    }
  }

  return makeSuccessResponse({});
});
