class Client {
  private url = 'https://api.resend.com';

  constructor(private apiKey: string) {}

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

    return await resp.json();
  }
}

export const createResend = (apiKey: string) => new Client(apiKey);
