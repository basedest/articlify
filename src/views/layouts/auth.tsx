'use client';

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="from-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
            {children}
        </div>
    );
}
