'use server';

import { cookies } from 'next/headers';
import { getSession } from '../auth';

const getBaseURL = () =>
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function resendVerificationEmail(): Promise<{ ok: true } | { ok: false; error: string }> {
    const session = await getSession();
    if (!session?.user?.email) {
        return { ok: false, error: 'session_required' };
    }

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const baseURL = getBaseURL();

    const res = await fetch(`${baseURL}/api/auth/send-verification-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
        },
        body: JSON.stringify({
            email: session.user.email,
            callbackURL: '/dashboard',
        }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = (data as { message?: string })?.message ?? 'resend_failed';
        return { ok: false, error: message };
    }

    return { ok: true };
}
