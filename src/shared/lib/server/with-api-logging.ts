import { v4 as uuidv4 } from 'uuid';
import { context, trace } from '@opentelemetry/api';
import { log } from '~/shared/lib/server/logger';

const X_REQUEST_ID = 'x-request-id';

export type ApiLogContext = {
    requestId: string;
    traceId?: string;
};

export type ApiRouteHandler = (req: Request, logContext: ApiLogContext) => Promise<Response>;

/**
 * Wraps an API route handler with request ID generation, trace ID propagation,
 * and structured logging (request success with duration, errors with stack).
 * Sets X-Request-ID on the response.
 */
export function withApiLogging(handler: ApiRouteHandler): (req: Request) => Promise<Response> {
    return async (req: Request): Promise<Response> => {
        const requestId = req.headers.get(X_REQUEST_ID) ?? uuidv4();
        const traceId = trace.getSpan(context.active())?.spanContext().traceId;
        const url = req.url;
        const start = Date.now();

        try {
            const response = await handler(req, { requestId, traceId });
            const durationMs = Date.now() - start;

            log({
                level: 'info',
                message: 'api route success',
                requestId,
                traceId,
                url,
                durationMs,
            });

            return withRequestIdHeader(response, requestId);
        } catch (err) {
            const durationMs = Date.now() - start;
            const message = err instanceof Error ? err.message : String(err);
            const stack = err instanceof Error ? err.stack : undefined;

            log({
                level: 'error',
                message: 'api route error',
                requestId,
                traceId,
                url,
                durationMs,
                extra: { message, stack },
            });

            throw err;
        }
    };
}

function withRequestIdHeader(response: Response, requestId: string): Response {
    const headers = new Headers(response.headers);
    headers.set(X_REQUEST_ID, requestId);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}
