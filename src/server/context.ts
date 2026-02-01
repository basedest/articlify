import { type Session } from 'next-auth';
import { auth } from '~/auth';

export type Context = {
    session: Session | null;
};

export async function createContext(): Promise<Context> {
    let session: Session | null = null;

    try {
        // Try to get session - will fail during build/generateStaticParams
        session = (await auth()) as Session | null;
    } catch (error) {
        // During build time or outside request scope, session is null
        // This is expected for generateStaticParams and other build-time operations
        session = null;
    }

    return {
        session,
    };
}

/** Public context (no auth). Use for static/ISR pages to avoid reading headers(). */
export function createPublicContext(): Context {
    return { session: null };
}
