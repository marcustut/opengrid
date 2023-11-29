import { useQuery } from '@tanstack/react-query';

import type { Supabase } from '@/lib/client/supabase';

const fetchAlert = async (supabase: Supabase) => {
  const session = await supabase.auth.getSession();
  if (session.error) throw session.error;
  if (!session.data.session) throw new Error('No session found');

  const alerts = await supabase
    .from('alert')
    .select('*')
    .eq('user_id', session.data.session.user.id);
  if (alerts.error) {
    console.error(alerts.error);
    throw new Error(alerts.error.message);
  }

  return alerts.data;
};

const fetchAlertType = async (supabase: Supabase) => {
  const alertTypes = await supabase.from('alert_type').select('*');
  if (alertTypes.error) {
    console.error(alertTypes.error);
    throw new Error(alertTypes.error.message);
  }

  return alertTypes.data;
};

export const alert = {
  queryKey: () => ['alerts'],
  queryFn: fetchAlert,
  useQuery: (supabase: Supabase) =>
    useQuery({
      queryKey: alert.queryKey(),
      queryFn: () => alert.queryFn(supabase),
    }),
};

export const alertType = {
  queryKey: () => ['alertTypes'],
  queryFn: fetchAlertType,
  useQuery: (supabase: Supabase) =>
    useQuery({
      queryKey: alertType.queryKey(),
      queryFn: () => alertType.queryFn(supabase),
    }),
};
