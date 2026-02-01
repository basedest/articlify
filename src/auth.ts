import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '~/lib/server/mongodb-client';
import { UserModel } from '~/lib/UserTypes';
import { connectDB } from '~/lib/server/connection';

/** Max length for image URL in JWT/session cookie to avoid ERR_RESPONSE_HEADERS_TOO_BIG. */
const MAX_IMAGE_URL_LENGTH = 2000;

function safeImageForCookie(image: string | undefined | null): string | undefined {
    if (image == null || image === '') return undefined;
    // Data URLs (base64) are huge; never put them in cookies
    if (image.startsWith('data:')) return undefined;
    if (image.length > MAX_IMAGE_URL_LENGTH) return undefined;
    return image;
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
            role?: string;
            regDate?: Date;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        name: string;
        email: string;
        image?: string;
        role?: string;
        regDate?: Date;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise) as NextAuthConfig['adapter'],
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                await connectDB();
                const user = await UserModel.findOne({ name: credentials.username });

                if (!user) {
                    return null;
                }

                const isValid = await user.comparePassword(credentials.password as string);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    regDate: user.regDate,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                // Only store short URLs in JWT to avoid ERR_RESPONSE_HEADERS_TOO_BIG
                token.image = safeImageForCookie(user.image);
                token.role = user.role;
                token.regDate = user.regDate;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string | undefined;
                session.user.regDate = token.regDate as Date | undefined;
                // Load image from DB so avatar updates after upload without re-login (URLs only, cookie-safe)
                try {
                    await connectDB();
                    const user = await UserModel.findById(token.id).select('image').lean();
                    if (user?.image !== undefined) {
                        session.user.image = safeImageForCookie(user.image as string) ?? undefined;
                    } else {
                        session.user.image = (token.image as string | undefined) || undefined;
                    }
                } catch {
                    session.user.image = (token.image as string | undefined) || undefined;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});
