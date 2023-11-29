import { format, parse, parseISO } from 'date-fns';
import { z } from 'zod';

const DATE_PATTERN = 'dd-MMM-yyyy HH:mm:ss';

const dateSchema = z.string().transform((x) => parse(x, DATE_PATTERN, new Date()));

export const requestSchema = z.object({
  type: z.enum(['actual', 'forecast']),
  region: z.enum(['ROI', 'NI', 'ALL']),
  from: z
    .union([z.string(), z.date()])
    .transform((x) => (x instanceof Date ? x : (parseISO(x) as Date))),
  to: z
    .union([z.string(), z.date()])
    .transform((x) => (x instanceof Date ? x : (parseISO(x) as Date))),
});
export const responseDataSchema = z.object({
  EffectiveTime: dateSchema,
  FieldName: z.enum(['SYSTEM_DEMAND', 'DEMAND_FORECAST_VALUE', 'WIND_ACTUAL', 'WIND_FCAST']),
  Region: z.enum(['ROI', 'NI', 'ALL']),
  Value: z.number().nullable(),
});
export const responseSchema = z.discriminatedUnion('Status', [
  z.object({
    ErrorMessage: z.null(),
    LastUpdated: dateSchema,
    Rows: z.array(responseDataSchema),
    Status: z.literal('Success'),
  }),
  z.object({
    ErrorMessage: z.string(),
    LastUpdated: z.null(),
    Rows: z.array(responseDataSchema),
    Status: z.literal('Error'),
  }),
]);

class Client {
  private url = 'https://www.smartgriddashboard.com';

  private makeUrl(type: 'dashboard', params: Record<string, string>): string {
    const path = type === 'dashboard' ? 'DashboardService.svc/data' : '';
    const query =
      Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : '';
    return `${this.url}/${path}${query}`;
  }

  private formatDate(date: Date): string {
    return format(date, DATE_PATTERN);
  }

  private async handler(opts: z.infer<typeof requestSchema>, type: 'demand' | 'wind') {
    const params = {
      area: `${type}${opts.type}`,
      region: opts.region,
      datefrom: this.formatDate(opts.from),
      dateto: this.formatDate(opts.to),
    };
    const url = this.makeUrl('dashboard', params);
    const resp = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
    if (!resp.ok) throw new Error(`DashboardAPIError(${type}${opts.type}): ${resp.statusText}`);

    const body = responseSchema.parse(await resp.json());
    if (body.Status === 'Error')
      throw new Error(`DashboardAPIError(${type}${opts.type}): ${body.ErrorMessage}`);

    return body.Rows;
  }

  async demand(opts: z.infer<typeof requestSchema>) {
    return await this.handler(opts, 'demand');
  }

  async wind(opts: z.infer<typeof requestSchema>) {
    return await this.handler(opts, 'wind');
  }
}

export const createSmartGrid = () => new Client();
