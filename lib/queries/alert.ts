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

export enum Comparator {
  Equal = 'eq',
  NotEqual = 'neq',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
}

export const getComparatorName = (comparator: `${Comparator}`) => {
  switch (comparator) {
    case Comparator.Equal:
      return 'Equal';
    case Comparator.NotEqual:
      return 'Not equal';
    case Comparator.GreaterThan:
      return 'Greater than';
    case Comparator.GreaterThanOrEqual:
      return 'Greater than or equal';
    case Comparator.LessThan:
      return 'Less than';
    case Comparator.LessThanOrEqual:
      return 'Less than or equal';
  }
};

export const getComparatorSymbol = (comparator: `${Comparator}`) => {
  switch (comparator) {
    case Comparator.Equal:
      return '=';
    case Comparator.NotEqual:
      return '≠';
    case Comparator.GreaterThan:
      return '>';
    case Comparator.GreaterThanOrEqual:
      return '≥';
    case Comparator.LessThan:
      return '<';
    case Comparator.LessThanOrEqual:
      return '≤';
  }
};
