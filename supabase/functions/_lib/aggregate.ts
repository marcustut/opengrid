import { isEqual } from 'date-fns';
import type { z } from 'zod';

import type { responseDataSchema } from './smartgrid.ts';

type SmartGridResponse = z.infer<typeof responseDataSchema>[];

const netDemand = ({
  wind,
  demand,
}: {
  demand: { actual: SmartGridResponse; forecast: SmartGridResponse };
  wind: { actual: SmartGridResponse; forecast: SmartGridResponse };
}) => {
  return [demand.actual, demand.forecast, wind.actual, wind.forecast]
    .reduce(
      (acc, data) => {
        if (!data) return acc;

        for (const { EffectiveTime, FieldName, Value } of data) {
          const i = acc.findIndex(({ timestamp }) => isEqual(timestamp, EffectiveTime));
          const value = Value ?? null;

          if (i == -1) {
            acc.push({
              timestamp: EffectiveTime,
              demand: {
                actual: FieldName === 'SYSTEM_DEMAND' ? value : null,
                forecast: FieldName === 'DEMAND_FORECAST_VALUE' ? value : null,
              },
              wind: {
                actual: FieldName === 'WIND_ACTUAL' ? value : null,
                forecast: FieldName === 'WIND_FCAST' ? value : null,
              },
            });
            continue;
          }

          if (FieldName === 'WIND_ACTUAL') acc[i].wind.actual = value;
          else if (FieldName === 'WIND_FCAST') acc[i].wind.forecast = value;
          else if (FieldName === 'SYSTEM_DEMAND') acc[i].demand.actual = value;
          else if (FieldName === 'DEMAND_FORECAST_VALUE') acc[i].demand.forecast = value;
        }

        return acc;
      },
      [] as {
        timestamp: Date;
        demand: { actual: number | null; forecast: number | null };
        wind: { actual: number | null; forecast: number | null };
      }[],
    )
    .filter(({ demand, wind }) => {
      if (!demand.actual && !demand.forecast) return false;
      if (!wind.actual && !wind.forecast) return false;
      return true;
    })
    .map(({ timestamp, demand, wind }) => ({
      timestamp,
      value: demand.actual ?? demand.forecast! - (wind.actual ?? wind.forecast!),
    }));
};

const average = (arr: number[]) =>
  arr.length > 0 ? arr.reduce((acc, x) => acc + x, 0) / arr.length : 0;

const toDateRange = (arr: Date[], predicate: (x: Date, y: Date) => boolean) => {
  if (arr.length < 2) throw new Error('toDateRange must have at least 2 dates');

  const ret: { from: Date; to: Date }[] = [];

  const map = new Map<string, Date>();
  for (let i = 0; i < arr.length - 1; i++) {
    if (predicate(arr[i], arr[i + 1])) continue;

    if (!map.has('from')) {
      map.set('from', arr[i]);
      continue;
    }
    if (!map.has('to')) {
      ret.push({ from: map.get('from')!, to: arr[i] });
      map.clear();
      continue;
    }
  }

  // Edge case: where there is no gap
  if (ret.length === 0) return [{ from: arr[0], to: arr[arr.length - 1] }];

  return ret;
};

const aggregator = { netDemand, average, toDateRange };

export default aggregator;
