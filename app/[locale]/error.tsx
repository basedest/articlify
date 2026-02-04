'use client';

import { useEffect } from 'react';
import { Button } from '~/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '~/shared/ui/alert';
import { AlertCircle } from 'lucide-react';
import { reportError } from '~/shared/lib/server/report-error';
import { useTranslations } from 'next-intl';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('common');
    const tButton = useTranslations('button');
    const tError = useTranslations('error');

    useEffect(() => {
        reportError({
            message: error.message || tError('unexpected'),
            digest: error.digest,
            stack: error.stack,
        });
    }, [error, tError]);

    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('somethingWentWrong')}</AlertTitle>
                <AlertDescription className="mt-2">{error.message || tError('unexpected')}</AlertDescription>
                <Button onClick={reset} className="mt-4" variant="outline">
                    {tButton('tryAgain')}
                </Button>
            </Alert>
        </div>
    );
}
