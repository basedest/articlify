import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { betterAuth, generateId } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { clientPromise } from '~/shared/lib/server/mongodb-client';

const client = await clientPromise;
const db = client.db();
const useTransactions = process.env.MONGODB_USE_TRANSACTIONS === 'true';

const baseURL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
const isDev = process.env.NODE_ENV !== 'production';

export const auth = betterAuth({
    baseURL,
    trustedOrigins: [baseURL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    database: mongodbAdapter(db, useTransactions ? { client } : undefined),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes – required for getSession to work in Next.js server context
        },
    },
    advanced: {
        ...(isDev && {
            defaultCookieAttributes: {
                secure: false,
                sameSite: 'lax',
            },
        }),
        database: {
            generateId: ({ model }) => (model === 'user' ? new ObjectId().toString() : generateId(32)),
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        password: {
            hash: (password: string) => bcrypt.hash(password, 10),
            verify: (data: { password: string; hash: string }) => bcrypt.compare(data.password, data.hash),
        },
    },
    plugins: [username(), nextCookies()],
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false,
            },
            regDate: {
                type: 'date',
                required: false,
                input: false,
            },
            preferredLanguage: {
                type: 'string',
                required: false,
                input: true,
            },
        },
    },
});

export type Session = (typeof auth)['$Infer']['Session'];

export async function getSession() {
    return auth.api.getSession({ headers: await headers() });
}
