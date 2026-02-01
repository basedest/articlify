import { v4 as uuidv4 } from 'uuid';
import { context, trace } from '@opentelemetry/api';
import { type Session } from 'next-auth';
import { auth } from '~/auth';

const X_REQUEST_ID = 'x-request-id';

export type Context = {
    session: Session | null;
    requestId?: string;
    traceId?: string;
};

export type CreateContextOptions = {
    req: Request;
    resHeaders?: Headers;
};

export async function createContext(opts?: CreateContextOptions): Promise<Context> {
    let session: Session | null = null;
    let requestId: string | undefined;
    let traceId: string | undefined;

    if (opts?.req) {
        requestId = opts.req.headers.get(X_REQUEST_ID) ?? uuidv4();
        traceId = trace.getSpan(context.active())?.spanContext().traceId;
        opts.resHeaders?.set(X_REQUEST_ID, requestId);
    } else {
        requestId = uuidv4();
        traceId = trace.getSpan(context.active())?.spanContext().traceId;
    }

    try {
        // Try to get session - will fail during build/generateStaticParams
        session = (await auth()) as Session | null;
    } catch {
        // During build time or outside request scope, session is null
        session = null;
    }

    return {
        session,
        requestId,
        traceId,
    };
}

/** Public context (no auth). Use for static/ISR pages to avoid reading headers(). */
export function createPublicContext(): Context {
    return {
        session: null,
        requestId: uuidv4(),
        traceId: trace.getSpan(context.active())?.spanContext().traceId,
    };
}
