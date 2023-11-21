'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TrashIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { startCase } from 'lodash';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/client/supabase';
import type { Database } from '@/lib/database.types';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import {
  Comparator,
  alert,
  alertType,
  getComparatorName,
  getComparatorSymbol,
} from '@/lib/queries/alert';
import { cn } from '@/lib/utils';

import { NewAlertSheet } from './new-alert-sheet';

const DeleteAlertDialog: React.FC<{ id: number }> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const handleContinue = useCallback(async () => {
    const { error } = await supabase.from('alert').delete().eq('id', id);
    if (error) {
      console.error(error);
      toast({
        title: 'Failed to delete alert',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: alert.queryKey() });
    toast({ title: '✅ Alert deleted' });
    setOpen(false);
  }, [id]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-8 h-8 p-0 ml-auto" variant="outline">
          <TrashIcon className="text-secondary-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete the alert and the server will stop
            sending you notifications.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={'destructive'} onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const formSchema = z
  .object({
    alert_type: z.string(),
    comparator: z.nativeEnum(Comparator),
    threshold: z.number(),
  })
  .partial();

const UpdateAlertForm: React.FC<{ alert: Database['public']['Tables']['alert']['Row'] }> = ({
  alert: { id, alert_type, comparator, threshold },
}) => {
  const { LL } = useI18nContext();
  const { toast } = useToast();
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const alertTypes = alertType.useQuery(supabase);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alert_type: alert_type,
      comparator: comparator as Comparator,
      threshold: threshold,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from('alert').update(values).eq('id', id);
    if (error) {
      console.error(error);
      toast({
        title: 'Failed to update alert',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: alert.queryKey() });
    toast({ title: '✅ Alert updated' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormDescription>{LL.alert.newAlertForm.comparator.description()}</FormDescription>
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
        <Button type="submit" className="mt-2">
          {LL.save()}
        </Button>
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
    <div className="flex flex-col">
      <NewAlertSheet />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.data.map((alert) => (
          <Card key={alert.id} className="bg-card/60 relative">
            <TooltipProvider>
              <Tooltip>
                <div className="absolute -top-1.5 -right-1.5">
                  <TooltipTrigger
                    className={cn(
                      'w-4 h-4 rounded-full',
                      alert.active ? 'bg-green-500' : 'bg-red-600',
                    )}
                  />
                  <TooltipContent className="bg-secondary text-secondary-foreground">
                    {LL.alert.thisAlertIs({
                      name: (alert.active ? LL.alert.active() : LL.alert.disabled()).toLowerCase(),
                    })}
                  </TooltipContent>
                </div>
              </Tooltip>
            </TooltipProvider>
            <CardHeader>
              <CardTitle>{alert.name ?? 'Untitled'}</CardTitle>
              <CardDescription>{alert.description ?? 'No description.'}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <Popover>
                <PopoverTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold text-stone-500 dark:text-stone-300">
                          {startCase(alert.alert_type)} {getComparatorSymbol(alert.comparator)}{' '}
                          {alert.threshold}
                        </code>
                      </TooltipTrigger>
                      <TooltipContent className="bg-secondary text-secondary-foreground">
                        Click me to edit
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </PopoverTrigger>
                <PopoverContent>
                  <UpdateAlertForm alert={alert} />
                </PopoverContent>
              </Popover>
              <DeleteAlertDialog id={alert.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
