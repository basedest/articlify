'use client';

import { useState } from 'react';
import { Link } from 'i18n/navigation';
import { authClient } from '~/shared/api/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Alert, AlertDescription } from '~/shared/ui/alert';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '~/features/i18n';
import { Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
    const t = useTranslations('auth');
    const tButton = useTranslations('button');
    const tForm = useTranslations('form');

    const [email, setEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState('');

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        setResendLoading(true);
        setResendError('');
        setResendSuccess(false);
        try {
            const { error } = await (
                authClient.sendVerificationEmail as (opts: {
                    email: string;
                    callbackURL?: string;
                }) => Promise<{ error?: { message?: string } }>
            )({
                email,
                callbackURL: '/dashboard',
            });
            if (error) {
                setResendError(error.message ?? t('resendVerificationFailed'));
            } else {
                setResendSuccess(true);
            }
        } catch {
            setResendError(t('resendVerificationFailed'));
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">{t('checkEmailTitle')}</CardTitle>
                        <CardDescription>{t('checkEmailDescription')}</CardDescription>
                    </div>
                    <LanguageSwitcher variant="compact" className="shrink-0" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleResend} className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="resend-email">{tForm('email')}</Label>
                        <Input
                            id="resend-email"
                            type="email"
                            placeholder={tForm('placeholderEmail')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {resendSuccess && (
                        <Alert>
                            <AlertDescription>{t('resendVerificationSuccess')}</AlertDescription>
                        </Alert>
                    )}
                    {resendError && (
                        <Alert variant="destructive">
                            <AlertDescription>{resendError}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" variant="secondary" className="w-full" disabled={resendLoading}>
                        {resendLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('resendVerification')}
                            </>
                        ) : (
                            t('resendVerification')
                        )}
                    </Button>
                </form>
                <Button asChild className="w-full">
                    <Link href="/login">{tButton('login')}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
