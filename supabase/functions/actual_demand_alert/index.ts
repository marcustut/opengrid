import { startOfDay } from 'date-fns';

import { createResend } from '../_lib/resend.ts';
import { makeErrorResponse, makeSuccessResponse } from '../_lib/response.ts';
import { createSmartGrid } from '../_lib/smartgrid.ts';
import { createSupabase } from '../_lib/supabase.ts';

const smartgrid = createSmartGrid();
const resend = createResend(Deno.env.get('RESEND_API_KEY')!);
const supabase = createSupabase({
  url: Deno.env.get('SUPABASE_URL')!,
  key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
});

Deno.serve(async () => {
  console.log('Running actual demand alert');

  const { data, error } = await supabase.from('alert').select('*').eq('active', true);
  if (error) {
    console.error(error);
    console.error('Exiting due to error');
    return makeErrorResponse(error);
  }

  const regions = [...new Set(data.map(({ region }) => region))];

  for (const region of regions) {
    try {
      const from = startOfDay(new Date());
      const to = new Date();
      console.log('Fetching actual demand for ', region);
      const demands = (await smartgrid.demand({ region, type: 'actual', from, to }))?.filter(
        (demand) => !!demand.Value,
      );
      if (!demands) throw new Error('Failed to fetch actual demand');
      const demand = demands[demands.length - 1];
      console.log('Current actual demand: ', demand.Value);
      for (const alert of data.filter(({ region: r }) => r === region)) {
        const { threshold, comparator, message } = alert;
        let title = '';
        switch (comparator) {
          case 'eq':
            if (demand.Value === threshold)
              title = `Acutal System Demand in ${region} is equal to ${threshold}`;
            break;
          case 'neq':
            if (demand.Value !== threshold)
              title = `Acutal System Demand in ${region} is not equal to ${threshold}`;
            break;
          case 'lt':
            if (demand.Value && demand.Value < threshold)
              title = `Acutal System Demand in ${region} is lesser than ${threshold}`;
            break;
          case 'lte':
            if (demand.Value && demand.Value <= threshold)
              title = `Acutal System Demand in ${region} is lesser than or equal to ${threshold}`;
            break;
          case 'gt':
            if (demand.Value && demand.Value > threshold)
              title = `Acutal System Demand in ${region} is greater than ${threshold}`;
            break;
          case 'gte':
            if (demand.Value && demand.Value >= threshold)
              title = `Acutal System Demand in ${region} is greater than or equal to ${threshold}`;
            break;
        }
        if (title === '') continue;

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

        const params = {
          from: 'notification@opengrid.marcustut.me',
          to: [data.user.email],
          subject: title,
          html: message ?? title,
        };

        // Insert into database
        console.log(`Creating notification for ${alert.user_id} in database`);
        const notification = await supabase
          .from('email_notification')
          .insert({ ...params, to: params.to[0], status: 'pending' })
          .select('id');
        if (notification.error || notification.data.length === 0) {
          console.error(error);
          console.error('Skipping due to failed to insert notification');
          continue;
        }

        // Send email
        console.log(`Sending email to ${params.to}`);
        await resend.sendEmail(params);

        // Update to success
        console.log(`Updating email to status success`);
        const { error: updateNotificationError } = await supabase
          .from('email_notification')
          .update({ status: 'success' })
          .eq('id', notification.data[0].id);
        if (updateNotificationError) {
          console.error(error);
          console.error('Skipping due to failed to update notification');
          continue;
        }
      }
    } catch (err) {
      console.error(err);
      console.error('Exiting due to failed to fetch actual demand');
      return makeErrorResponse(err);
    }
  }

  return makeSuccessResponse({});
});
