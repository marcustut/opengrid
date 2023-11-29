'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startCase } from 'lodash';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/client/supabase';
import type { Database } from '@/lib/database.types';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import { alert } from '@/lib/queries/alert';

const formSchema = z.object({ send_email: z.boolean() });

const AlertSettings: React.FC<{ alert: Database['public']['Tables']['alert']['Row'] }> = ({
  alert,
}) => {
  const { toast } = useToast();
  const supabase = useSupabase();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { send_email: alert.send_email },
  });

  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name !== 'send_email') return;

      const { error } = await supabase
        .from('alert')
        .update({ active: true, send_email: value.send_email })
        .eq('id', alert.id)
        .select();

      error
        ? toast({
            title: 'Failed to enable email notifications',
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-stone-950 p-4">
                <code className="text-white">{error.message}</code>
              </pre>
            ),
          })
        : toast({ title: `${value.send_email ? 'Enabled' : 'Disabled'} email notifications` });
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form className="w-full space-y-4">
        <h3 className="mb-4 text-lg font-medium">{startCase(alert.alert_type) + ' Alert'}</h3>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="send_email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email notifications</FormLabel>
                  <FormDescription>Receive emails for {alert.alert_type} alerts.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name=""
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email notifications</FormLabel>
                  <FormDescription>Receive emails for {alert.alert_type} alerts.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          /> */}
        </div>
      </form>
    </Form>
  );
};

export const Alerts: React.FC = () => {
  const { LL } = useI18nContext();
  const supabase = useSupabase();
  const alerts = alert.useQuery(supabase);

  if (alerts.error)
    return (
      <Error
        title={LL.failedToLoad({ name: LL.alert.alert() })}
        description={alerts.error.message}
      />
    );
  if (!alerts.data) return <Loading description={LL.loading({ name: LL.alert.alert() })} />;

  return (
    <div className="w-full flex flex-col space-y-8">
      {alerts.data.map((alert) => (
        <AlertSettings key={alert.id} alert={alert} />
      ))}
    </div>
  );
};
