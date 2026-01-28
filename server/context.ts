import { type Session } from 'next-auth';
import { auth } from '@/auth';

export async function createContext() {
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

export type Context = Awaited<ReturnType<typeof createContext>>;
