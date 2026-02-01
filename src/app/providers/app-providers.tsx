'use client';

import { SessionProvider } from '~/app/providers/session-provider';
import { ThemeProvider } from '~/app/providers/theme-provider';
import { TRPCProvider } from '~/app/providers/trpc-provider';
import { Toaster } from '~/shared/ui/toaster';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <TRPCProvider>
                    {children}
                    <Toaster />
                </TRPCProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
