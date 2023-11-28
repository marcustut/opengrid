'use client';

import { useQueries } from '@tanstack/react-query';
import { format, isEqual, startOfToday, startOfTomorrow } from 'date-fns';
import { type ReactNode, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSupabase } from '@/lib/client/supabase';
import { theme } from '@/lib/client/theme';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import { demand } from '@/lib/queries/demand';
import { wind } from '@/lib/queries/wind';
import { cn } from '@/lib/utils';

export const NetDemandChart: React.FC<{ className?: string }> = ({ className }) => (
  <ChartCard
    title="Net Demand"
    description="Net demand represents the electricity production by taking the actual and forecast system demand and deduct them with the current wind generation."
    className={className}
    chart={({ region, from, to }) => (
      <div className={cn('h-[400px] flex justify-center items-center')}>
        <ActualForecastNetDemand region={region} from={from} to={to} />
      </div>
    )}
  />
);

export const SystemDemandChart: React.FC<{ className?: string }> = ({ className }) => (
  <ChartCard
    title="System Demand"
    description="System demand represents the electricity production required to meet national consumption. Actual and forecast System Demand are shown in 15 minute intervals."
    className={className}
    chart={({ region, from, to }) => (
      <div className={cn('h-[400px] flex justify-center items-center')}>
        <ActualForecastSystemDemand region={region} from={from} to={to} />
      </div>
    )}
  />
);

export const WindGenerationChart: React.FC<{ className?: string }> = ({ className }) => (
  <ChartCard
    title="Wind Generation"
    description="Wind Generation is an estimate of the total electrical output of all wind farms on the system. Actual and Forecast Wind Generation are shown in 15 minute intervals."
    className={className}
    chart={({ region, from, to }) => (
      <div className={cn('h-[400px] flex justify-center items-center')}>
        <ActualForecastWindGeneration region={region} from={from} to={to} />
      </div>
    )}
  />
);

type ChartProps = {
  region: 'ROI' | 'NI' | 'ALL';
  from: Date;
  to: Date;
};
type ChartCardProps = {
  className?: string;
  title?: string;
  description?: string;
  chart: (props: ChartProps) => ReactNode;
};

const ChartCard: React.FC<ChartCardProps> = ({ title, description, className, chart }) => {
  const [region, setRegion] = useState<'ROI' | 'NI' | 'ALL'>('ALL');
  const [from, setFrom] = useState(startOfToday());
  const [to] = useState(startOfTomorrow());

  return (
    <Card className={cn('bg-card/60', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="whitespace-pre-wrap">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Choose date</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="range"
                  selected={{ from, to }}
                  onSelect={(val) => {
                    if (!val) return;
                    if (val.from) setFrom(val.from);
                  }}
                />
              </PopoverContent>
            </Popover>
            <Select onValueChange={(val) => setRegion(val as 'ROI' | 'NI')} defaultValue={region}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROI">Republic of Ireland</SelectItem>
                <SelectItem value="NI">Northern Ireland</SelectItem>
                <SelectItem value="ALL">All Island</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge className="hidden sm:block">
            {format(from, 'MMM do, yyyy')} - {format(to, 'MMM do, yyyy')}
          </Badge>
        </div>
        {chart({ from, region, to })}
      </CardContent>
    </Card>
  );
};

const ActualForecastNetDemand: React.FC<ChartProps> = ({ region, from, to }) => {
  const { LL } = useI18nContext();
  const supabase = useSupabase();
  const generations = useQueries({
    queries: [
      ...(['actual', 'forecast'] as const).map((type) => ({
        queryKey: wind.queryKey({ type, region, from, to }),
        queryFn: () => wind.queryFn(supabase)({ type, region, from, to }),
      })),
      ...(['actual', 'forecast'] as const).map((type) => ({
        queryKey: demand.queryKey({ type, region, from, to }),
        queryFn: () => demand.queryFn(supabase)({ type, region, from, to }),
      })),
    ],
    combine: (results) => ({
      data: results
        .reduce(
          (acc, { data }) => {
            if (!data) return acc;

            for (const { EffectiveTime, FieldName, Value } of data) {
              const i = acc.findIndex(({ timestamp }) => isEqual(timestamp, EffectiveTime));

              if (i == -1) {
                acc.push({
                  timestamp: EffectiveTime,
                  demand: {
                    actual: FieldName === 'SYSTEM_DEMAND' ? Value : null,
                    forecast: FieldName === 'DEMAND_FORECAST_VALUE' ? Value : null,
                  },
                  wind: {
                    actual: FieldName === 'WIND_ACTUAL' ? Value : null,
                    forecast: FieldName === 'WIND_FCAST' ? Value : null,
                  },
                });
                continue;
              }

              if (FieldName === 'WIND_ACTUAL') acc[i].wind.actual = Value;
              else if (FieldName === 'WIND_FCAST') acc[i].wind.forecast = Value;
              else if (FieldName === 'SYSTEM_DEMAND') acc[i].demand.actual = Value;
              else if (FieldName === 'DEMAND_FORECAST_VALUE') acc[i].demand.forecast = Value;
            }

            return acc;
          },
          [] as {
            timestamp: Date;
            demand: { actual: number | null; forecast: number | null };
            wind: { actual: number | null; forecast: number | null };
          }[],
        )
        .map(({ timestamp, demand, wind }, i, arr) => {
          const demandForecast = demand.forecast ?? arr[Math.max(0, i - 1)].demand.forecast;
          return {
            timestamp,
            actual: demand.actual ? demand.actual - (wind.actual ?? 0) : null,
            forecast: demandForecast ? demandForecast - (wind.forecast ?? 0) : null,
          };
        }),
      error: results.find(({ error }) => error)?.error ?? null,
      status: results.some(({ status }) => status === 'pending')
        ? 'pending'
        : results.some(({ status }) => status === 'error')
          ? 'error'
          : 'success',
    }),
  });

  if (generations.status === 'error')
    return (
      <Error
        title={LL.failedToLoad({ name: LL.windGeneration() })}
        description={generations.error?.message}
      />
    );
  if (generations.status === 'pending')
    return <Loading description={LL.loading({ name: LL.windGeneration() })} />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={generations.data}>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const data = payload[0].payload as NonNullable<(typeof generations.data)[0]>;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase text-muted-foreground">
                      {format(data.timestamp, 'dd MMMM yyyy p')}
                    </span>
                    {data.actual && <span className="font-bold">{data.actual} MW (Actual)</span>}
                    {data.forecast && (
                      <span className="font-bold">{data.forecast} MW (Forecast)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="actual"
          dot={false}
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
          style={{ stroke: theme.colors.primary.DEFAULT }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="forecast"
          dot={false}
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
          style={{ stroke: theme.colors.primary.foreground }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ActualForecastSystemDemand: React.FC<ChartProps> = ({ region, from, to }) => {
  const { LL } = useI18nContext();
  const supabase = useSupabase();
  const demands = useQueries({
    queries: (['actual', 'forecast'] as const).map((type) => ({
      queryKey: demand.queryKey({ type, region, from, to }),
      queryFn: () => demand.queryFn(supabase)({ type, region, from, to }),
    })),
    combine: (results) => ({
      data: results.flatMap(
        ({ data }) =>
          data
            ?.map(({ Value, EffectiveTime, FieldName }) => ({
              timestamp: EffectiveTime,
              actual: FieldName === 'SYSTEM_DEMAND' ? Value : null,
              forecast: FieldName === 'DEMAND_FORECAST_VALUE' ? Value : null,
            }))
            .filter(({ actual, forecast }) => actual !== null || forecast !== null),
      ),
      error: results.find(({ error }) => error)?.error ?? null,
      status: results.some(({ status }) => status === 'pending')
        ? 'pending'
        : results.some(({ status }) => status === 'error')
          ? 'error'
          : 'success',
    }),
  });

  if (demands.status === 'error')
    return (
      <Error
        title={LL.failedToLoad({ name: LL.systemDemand() })}
        description={demands.error?.message}
      />
    );
  if (demands.status === 'pending')
    return <Loading description={LL.loading({ name: LL.systemDemand() })} />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={demands.data}>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const data = payload[0].payload as NonNullable<(typeof demands.data)[0]>;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase text-muted-foreground">
                      {format(data.timestamp, 'dd MMMM yyyy p')}
                    </span>
                    <span className="font-bold">
                      {payload[0].value} MW (
                      {`${payload[0].dataKey === 'actual' ? 'Actual' : 'Forecast'}`})
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="actual"
          dot={false}
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
          style={{ stroke: theme.colors.primary.DEFAULT }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="forecast"
          dot={false}
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
          style={{ stroke: theme.colors.primary.foreground }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ActualForecastWindGeneration: React.FC<ChartProps> = ({ region, from, to }) => {
  const { LL } = useI18nContext();
  const supabase = useSupabase();
  const generations = useQueries({
    queries: (['actual', 'forecast'] as const).map((type) => ({
      queryKey: wind.queryKey({ type, region, from, to }),
      queryFn: () => wind.queryFn(supabase)({ type, region, from, to }),
    })),
    combine: (results) => ({
      data: results.reduce(
        (acc, { data }) => {
          if (!data) return acc;

          for (const { EffectiveTime, FieldName, Value } of data) {
            const i = acc.findIndex(({ timestamp }) => isEqual(timestamp, EffectiveTime));

            if (i == -1) {
              acc.push({
                timestamp: EffectiveTime,
                actual: FieldName === 'WIND_ACTUAL' ? Value : null,
                forecast: FieldName === 'WIND_FCAST' ? Value : null,
              });
              continue;
            }

            if (FieldName === 'WIND_ACTUAL') acc[i].actual = Value;
            else if (FieldName === 'WIND_FCAST') acc[i].forecast = Value;
          }

          return acc;
        },
        [] as { timestamp: Date; actual: number | null; forecast: number | null }[],
      ),
      error: results.find(({ error }) => error)?.error ?? null,
      status: results.some(({ status }) => status === 'pending')
        ? 'pending'
        : results.some(({ status }) => status === 'error')
          ? 'error'
          : 'success',
    }),
  });

  if (generations.status === 'error')
    return (
      <Error
        title={LL.failedToLoad({ name: LL.windGeneration() })}
        description={generations.error?.message}
      />
    );
  if (generations.status === 'pending')
    return <Loading description={LL.loading({ name: LL.windGeneration() })} />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={generations.data}>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const data = payload[0].payload as NonNullable<(typeof generations.data)[0]>;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase text-muted-foreground">
                      {format(data.timestamp, 'dd MMMM yyyy p')}
                    </span>
                    {data.actual && <span className="font-bold">{data.actual} MW (Actual)</span>}
                    {data.forecast && (
                      <span className="font-bold">{data.forecast} MW (Forecast)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="actual"
          dot={false}
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
          style={{ stroke: theme.colors.primary.DEFAULT }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="forecast"
          dot={false}
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary))' } }}
          style={{ stroke: theme.colors.primary.foreground }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
