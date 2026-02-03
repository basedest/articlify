import { Resend } from 'resend';
import type { Mailer, SendParams, SendResult } from './index';

export class ResendMailer implements Mailer {
    private client: Resend;
    private defaultFrom: string;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is required when MAILER_PROVIDER=resend. Set it in your environment.');
        }
        this.client = new Resend(apiKey);
        this.defaultFrom = process.env.MAILER_FROM || 'onboarding@resend.dev';
    }

    async send(params: SendParams): Promise<SendResult> {
        const to = Array.isArray(params.to) ? params.to : [params.to];
        const from = params.from ?? this.defaultFrom;
        const payload = typeof params.body === 'string' ? { html: params.body } : { react: params.body };

        const { data, error } = await this.client.emails.send(
            {
                from,
                to,
                subject: params.subject,
                replyTo: params.replyTo,
                ...payload,
            },
            params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : undefined,
        );

        if (error) {
            const err =
                error instanceof Error
                    ? error
                    : new Error(
                          typeof (error as { message?: string }).message === 'string'
                              ? (error as { message: string }).message
                              : String(error),
                      );
            return { success: false, error: err };
        }
        return { success: true, id: data?.id ?? undefined };
    }
}
