'use client';

import { useQueries } from '@tanstack/react-query';
import { format, startOfToday, startOfTomorrow } from 'date-fns';
import { useState } from 'react';
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
import { cn } from '@/lib/utils';

export const Demand: React.FC<{ className?: string }> = ({ className }) => {
  const [region, setRegion] = useState<'ROI' | 'NI'>('ROI');
  const [from, setFrom] = useState(startOfToday());
  const [to] = useState(startOfTomorrow());

  return (
    <>
      <Card className="bg-card/60">
        <CardHeader>
          <CardTitle>System Demand</CardTitle>
          <CardDescription className="whitespace-pre-wrap">
            System demand represents the electricity production required to meet national
            consumption.{'\n'}Actual and forecast System Demand are shown in 15 minute intervals.
          </CardDescription>
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
                </SelectContent>
              </Select>
            </div>
            <Badge className="hidden sm:block">
              {format(from, 'MMM do, yyyy')} - {format(to, 'MMM do, yyyy')}
            </Badge>
          </div>
          <div className={cn('h-[400px] flex justify-center items-center', className)}>
            <ActualForecastDemand region={region} from={from} to={to} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export const ActualForecastDemand: React.FC<{
  region: 'ROI' | 'NI';
  from: Date;
  to: Date;
}> = ({ region, from, to }) => {
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
