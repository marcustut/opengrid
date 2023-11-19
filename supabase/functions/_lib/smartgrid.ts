import { format, parse, parseISO } from 'date-fns';
import { z } from 'zod';

const DATE_PATTERN = 'dd-MMM-yyyy HH:mm';

const dateSchema = z.string().transform((x) => parse(x, DATE_PATTERN, new Date()));

const createDashboardResponseSchema = <T extends z.ZodTypeAny>(type: T) =>
  z.discriminatedUnion('Status', [
    z.object({
      ErrorMessage: z.null(),
      LastUpdated: dateSchema,
      Rows: z.array(type),
      Status: z.literal('Success'),
    }),
    z.object({
      ErrorMessage: z.string(),
      LastUpdated: z.null(),
      Rows: z.array(type),
      Status: z.literal('Error'),
    }),
  ]);

export const demandRequestSchema = z.object({
  type: z.enum(['actual', 'forecast']),
  region: z.enum(['ROI', 'NI']),
  from: z
    .union([z.string(), z.date()])
    .transform((x) => (x instanceof Date ? x : (parseISO(x) as Date))),
  to: z
    .union([z.string(), z.date()])
    .transform((x) => (x instanceof Date ? x : (parseISO(x) as Date))),
});
export const demandResponseSchema = createDashboardResponseSchema(
  z.object({
    EffectiveTime: dateSchema,
    FieldName: z.enum(['SYSTEM_DEMAND', 'DEMAND_FORECAST_VALUE']),
    Region: z.enum(['ROI', 'NI']),
    Value: z.number().nullable(),
  }),
);

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

  async demand(opts: z.infer<typeof demandRequestSchema>) {
    const params = {
      area: `demand${opts.type}`,
      region: opts.region,
      datefrom: this.formatDate(opts.from),
      dateto: this.formatDate(opts.to),
    };
    const url = this.makeUrl('dashboard', params);
    const resp = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
    if (!resp.ok) throw new Error(`DashboardAPIError(demand${opts.type}): ${resp.statusText}`);

    const body = demandResponseSchema.parse(await resp.json());
    if (body.Status === 'Error')
      throw new Error(`DashboardAPIError(demand${opts.type}): ${body.ErrorMessage}`);

    return body.Rows;
  }
}

export const createSmartGrid = () => new Client();
