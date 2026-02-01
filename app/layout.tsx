import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/app/styles/globals.css';
import { AppProviders } from '~/app/providers';
import { Header } from '~/widgets/header';
import { Footer } from '~/widgets/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Articlify - Modern Blog Platform',
    description: 'A modern blog platform built with Next.js, tRPC, and shadcn/ui',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AppProviders>
                    <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </AppProviders>
            </body>
        </html>
    );
}
