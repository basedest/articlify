import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { betterAuth, generateId } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { getServerConfig } from '~/shared/config/env/server';
import { clientPromise } from '~/shared/lib/server/mongodb-client';
import { getMailer } from '~/shared/lib/server/mailer';
import { VerificationEmailBody } from './lib/verification-email-body';
import * as React from 'react';
import { log } from '~/shared/lib/server/logger';

const client = await clientPromise;
const db = client.db();
const config = getServerConfig();
const { baseUrl: baseURL, trustedOrigins } = config.auth;
const isDev = config.nodeEnv !== 'production';

export const auth = betterAuth({
    baseURL,
    trustedOrigins,
    database: mongodbAdapter(db, config.mongodb.useTransactions ? { client } : undefined),
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
        requireEmailVerification: true,
        password: {
            hash: (password: string) => bcrypt.hash(password, 10),
            verify: (data: { password: string; hash: string }) => bcrypt.compare(data.password, data.hash),
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const mailer = getMailer();

            void mailer.send({
                to: user.email,
                subject: 'Verify your email address',
                body: React.createElement(VerificationEmailBody, { url }),
            });

            log({
                level: 'info',
                message: 'sent verification email',
                userId: user.id,
                extra: { url },
            });
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
