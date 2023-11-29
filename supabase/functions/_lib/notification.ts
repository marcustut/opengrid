import type { Resend } from './resend.ts';
import type { Supabase } from './supabase.ts';

type Config = { from: string; resend: Resend; supabase: Supabase };

class Client {
  constructor(private config: Config) {
    if (!config.from) throw new Error('from for Notification client cannot be undefined or null.');
  }

  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const params = { from: 'notification@opengrid.marcustut.me', to: [to], subject, html };

    // Insert into database
    console.log(`Creating notification for ${to} in database`);
    const notification = await this.config.supabase
      .from('email_notification')
      .insert({ ...params, to, status: 'pending' })
      .select('id');
    if (notification.error || notification.data.length === 0) {
      console.error(notification.error);
      console.error('Skipping due to failed to insert notification');
      return;
    }

    try {
      // Send email
      console.log(`Sending email to ${params.to}`);
      await this.config.resend.sendEmail(params);

      // Update to success
      console.log(`Updating email to status success`);
      const { error: updateNotificationError } = await this.config.supabase
        .from('email_notification')
        .update({ status: 'success' })
        .eq('id', notification.data[0].id);
      if (updateNotificationError) {
        console.error(updateNotificationError);
        console.error('Skipping due to failed to update notification');
        return;
      }
    } catch (err) {
      console.warn('Failed to send email hence updating the notification status to error');
      // Update to success
      console.log(`Updating email to status failed`);
      const { error: updateNotificationError } = await this.config.supabase
        .from('email_notification')
        .update({ status: 'error' })
        .eq('id', notification.data[0].id);
      if (updateNotificationError) {
        console.error(updateNotificationError);
        console.error('Skipping due to failed to update notification');
        return;
      }
      throw err instanceof Error ? err : `${err}`;
    }
  }
}

export type Notification = Client;
export const createNotification = (config: Config) => new Client(config);
