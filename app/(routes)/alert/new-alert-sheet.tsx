'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { startCase } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/client/supabase';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import { Comparator, alert, alertType, getComparatorName } from '@/lib/queries/alert';

const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  message: z.string().optional(),
  threshold: z.number(),
  alert_type: z.string(),
  comparator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte']),
  active: z.boolean().default(true),
});

export const NewAlertSheet: React.FC = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { LL } = useI18nContext();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });
  const alertTypes = alertType.useQuery(supabase);
  const { toast } = useToast();

  useEffect(() => {
    const subscription = form.watch((values, { name, type }) => {
      if (name !== 'alert_type' || type !== 'change' || !values.alert_type) return;
      if (!alertTypes.data) return;
      if (values.comparator || values.threshold) return;
      const alertType = alertTypes.data.find((alertType) => alertType.name === values.alert_type)!;
      alertType.default_comparator && form.setValue('comparator', alertType.default_comparator);
      alertType.default_threshold && form.setValue('threshold', alertType.default_threshold);
    });
    return () => subscription.unsubscribe();
  }, [alertTypes.data, form.watch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const session = await supabase.auth.getSession();
    if (session.error) {
      console.error(session.error);
      toast({
        title: 'Failed to create alert',
        description: session.error.message,
        variant: 'destructive',
      });
      return;
    }
    if (!session.data.session) {
      console.error('No session');
      toast({
        title: 'Failed to create alert',
        description: 'No session',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('alert').insert({
      ...values,
      name:
        values.name ??
        `${startCase(values.alert_type)} ${getComparatorName(values.comparator)} ${
          values.threshold
        }`,
      description:
        values.description ??
        `This alert will trigger when ${startCase(
          values.alert_type,
        ).toLowerCase()} is ${getComparatorName(values.comparator)} to ${values.threshold}.`,
      user_id: session.data.session.user.id,
    });
    if (error) {
      console.error(error);
      toast({
        title: 'Failed to create alert',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: alert.queryKey() });
    toast({
      title: 'Alert created',
      description: `An alert for ${startCase(values.alert_type)} has been successfully created.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {LL.new()} {LL.alert.alert().toLowerCase()}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll" side="right">
        <SheetHeader className="text-left">
          <SheetTitle>
            {LL.new()} {LL.alert.alert().toLowerCase()}
          </SheetTitle>
          <SheetDescription>{LL.alert.newAlertForm.subtitle()}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LL.alert.newAlertForm.name.label()}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={LL.alert.newAlertForm.name.label()}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {LL.alert.newAlertForm.name.description()} ({LL.optional().toLowerCase()})
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LL.alert.newAlertForm.description.label()}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={LL.alert.newAlertForm.description.label()} {...field} />
                  </FormControl>
                  <FormDescription>
                    {LL.alert.newAlertForm.description.description()} ({LL.optional().toLowerCase()}
                    )
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LL.alert.newAlertForm.message.label()}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={LL.alert.newAlertForm.message.label()} {...field} />
                  </FormControl>
                  <FormDescription>
                    {LL.alert.newAlertForm.message.description()} ({LL.optional().toLowerCase()})
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alert_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LL.alert.newAlertForm.alertType.label()}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={LL.alert.newAlertForm.alertType.label()} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {alertTypes.data?.map((alertType) => (
                        <SelectItem key={alertType.name} value={alertType.name}>
                          {startCase(alertType.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>{LL.alert.newAlertForm.alertType.description()}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comparator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LL.alert.newAlertForm.comparator.label()}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={LL.alert.newAlertForm.comparator.label()} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Comparator).map((comparator) => (
                        <SelectItem key={comparator} value={comparator}>
                          {getComparatorName(comparator)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {LL.alert.newAlertForm.comparator.description()}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LL.alert.newAlertForm.threshold.label()}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={LL.alert.newAlertForm.threshold.label()}
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormDescription>{LL.alert.newAlertForm.threshold.description()}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" className="mt-2">
                {LL.save()}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
