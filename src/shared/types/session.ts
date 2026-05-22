/** Roles supported by Better Auth additionalFields. */
export type UserRole = 'admin' | 'user';

/** Session user shape (includes Better Auth additionalFields). Use for client-side typing. */
export interface SessionUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: UserRole;
    regDate?: Date;
    preferredLanguage?: string;
    username?: string | null;
    displayUsername?: string | null;
}
