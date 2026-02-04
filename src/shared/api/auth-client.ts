'use client';

import { createAuthClient } from 'better-auth/react';
import { usernameClient } from 'better-auth/client/plugins';

const baseURL = typeof window !== 'undefined' ? window.location.origin : undefined;

export const authClient = createAuthClient({
    baseURL,
    plugins: [usernameClient()],
});
