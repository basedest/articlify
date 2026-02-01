'use client';

import { useEffect } from 'react';
import { Button } from '~/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '~/shared/ui/alert';
import { AlertCircle } from 'lucide-react';
import { reportError } from '~/shared/lib/server/report-error';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        reportError({
            message: error.message || 'An unexpected error occurred.',
            digest: error.digest,
            stack: error.stack,
        });
    }, [error]);

    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Something went wrong!</AlertTitle>
                <AlertDescription className="mt-2">{error.message || 'An unexpected error occurred.'}</AlertDescription>
                <Button onClick={reset} className="mt-4" variant="outline">
                    Try again
                </Button>
            </Alert>
        </div>
    );
}
