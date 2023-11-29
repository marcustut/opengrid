class Client {
  private url = 'https://api.resend.com';

  constructor(private apiKey: string) {
    if (!apiKey) throw new Error('apiKey for Resend client cannot be undefined or null.');
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  }) {
    const resp = await fetch(`${this.url}/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!resp.ok) throw new Error(`${JSON.stringify(await resp.json(), null, 2)}`);

    return await resp.json();
  }
}

export type Resend = Client;
export const createResend = (apiKey: string) => new Client(apiKey);
