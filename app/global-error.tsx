'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { reportError } from '~/shared/lib/server/report-error';
import { Button } from '~/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '~/shared/ui/alert';
import '~/app/styles/globals.css';

// next-intl context is unavailable above the [locale] segment, so we render
// EN + RU side-by-side rather than picking a single language for the user.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        void reportError({
            message: error.message || 'A critical error occurred.',
            digest: error.digest,
            stack: error.stack,
        });
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen antialiased">
                <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Something went wrong / Что-то пошло не так</AlertTitle>
                        <AlertDescription className="mt-2">
                            {error.message || 'A critical error occurred. / Произошла критическая ошибка.'}
                        </AlertDescription>
                        <Button onClick={reset} className="mt-4" variant="outline">
                            Try again / Попробовать снова
                        </Button>
                    </Alert>
                </div>
            </body>
        </html>
    );
}
