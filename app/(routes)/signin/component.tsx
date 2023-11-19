'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ArrowLeft } from '@/components/icons/arrow-left';
import { Door } from '@/components/icons/door';
import { Google } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createSupabase } from '@/lib/client/supabase';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import { cn } from '@/lib/utils';

export const LoginForm: React.FC = () => {
  const { LL } = useI18nContext();

  return (
    <div
      className={
        'flex flex-col justify-center p-6 rounded-2xl min-w-[360px] bg-stone-100/40 dark:bg-stone-900/60 border-2 border-stone-200/40 dark:border-stone-800/60 backdrop-blur-xl'
      }
    >
      <div
        className={
          'relative bg-stone-200 dark:bg-stone-800 text-stone-400 rounded-full mb-4 w-16 h-16 flex justify-center items-center'
        }
      >
        <Door className={'w-8 h-8 z-0'} />
        <ArrowLeft
          className={
            'absolute w-3 h-3 right-4 z-10 stroke-1 stroke-stone-200 dark:stroke-stone-800'
          }
        />
      </div>
      <div className={'mb-3'}>
        <span className={'text-xl font-semibold'}>{LL.welcomeTo({ name: 'OpenGrid' })}</span>
        <p className={'mt-1.5 text-sm text-stone-500 dark:text-stone-400'}>
          {LL.auth.signInDescription()}
        </p>
      </div>
      <EmailLoginForm />
      <div className={'w-[calc(100%+3rem)] -ml-6 h-[1px] bg-stone-200 dark:bg-stone-800'} />
      <SocialLoginButton className={'mt-4'} />
    </div>
  );
};

export const SocialLoginButton: React.FC<ComponentProps<typeof Button>> = (props) => {
  const supabase = createSupabase();
  const { LL } = useI18nContext();

  return (
    <Button
      {...props}
      className={cn(
        'bg-stone-200 hover:bg-stone-300 text-stone-500 hover:text-stone-600 dark:bg-stone-700 dark:hover:bg-stone-600 dark:text-stone-400 dark:hover:text-stone-50',
        props.className,
      )}
      variant={props.variant ?? 'secondary'}
      onClick={
        props.onClick ? props.onClick : () => supabase.auth.signInWithOAuth({ provider: 'google' })
      }
    >
      <Google className={'w-4 h-4 mr-2'} />
      {LL.auth.signInWith({ provider: 'Google' })}
    </Button>
  );
};

const formSchema = z.object({
  email: z.string().email(),
});

export const EmailLoginForm: React.FC = () => {
  const supabase = createSupabase();
  const { toast } = useToast();
  const { LL } = useI18nContext();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.signInWithOtp({ email: values.email });
    if (error) {
      toast({
        description: `Failed to send magic link to ${values.email}`,
        variant: 'destructive',
      });
      return;
    }
    toast({ description: LL.auth.magicLinkSent({ email: values.email }) });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'w-full'}>
        <FormField
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{LL.auth.email()}</FormLabel>
              <FormControl>
                <Input
                  id={'email'}
                  type={'email'}
                  className={'placeholder:text-stone-400 dark:placeholder:text-stone-500'}
                  placeholder={'you@email.com'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type={'submit'}
          className={'my-4 w-full'}
          disabled={
            form.formState.isSubmitting || form.formState.disabled || !form.formState.isValid
          }
        >
          {LL.auth.continueWith({ provider: LL.auth.email() })}
        </Button>
      </form>
    </Form>
  );
};
