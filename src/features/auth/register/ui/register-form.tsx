'use client';

import { useState } from 'react';
import { useRouter } from 'i18n/navigation';
import { Link } from 'i18n/navigation';
import { authClient } from '~/shared/api/auth-client';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Alert, AlertDescription } from '~/shared/ui/alert';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '~/features/i18n';

export function RegisterForm() {
    const router = useRouter();
    const t = useTranslations('auth');
    const tForm = useTranslations('form');
    const tButton = useTranslations('button');
    const tError = useTranslations('error');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(tError('passwordsDoNotMatch'));
            setIsLoading(false);
            return;
        }

        try {
            // API requires both name and username; form has a single "Username" field used for both.
            const { error: signUpError } = await (
                authClient.signUp.email as (opts: {
                    email: string;
                    password: string;
                    name: string;
                    username: string;
                }) => Promise<{ error?: { message?: string } }>
            )({
                email: formData.email,
                password: formData.password,
                name: formData.username,
                username: formData.username,
            });

            if (signUpError) {
                const msg = signUpError.message ?? '';
                const isEmailTaken = msg.includes('User already exists') && msg.includes('another email');
                setError(isEmailTaken ? tError('emailAlreadyTaken') : msg || tError('registrationFailed'));
            } else {
                router.push('/verify-email');
                router.refresh();
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : tError('registrationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">{t('registerTitle')}</CardTitle>
                        <CardDescription>{t('registerDescription')}</CardDescription>
                    </div>
                    <LanguageSwitcher variant="compact" className="shrink-0" />
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username">{tForm('username')}</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder={tForm('placeholderChooseUsername')}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{tForm('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={tForm('placeholderEmail')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{tForm('password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={tForm('placeholderCreatePassword')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{tForm('confirmPassword')}</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder={tForm('placeholderConfirmPassword')}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('creatingAccount')}
                            </>
                        ) : (
                            tButton('register')
                        )}
                    </Button>

                    <p className="text-muted-foreground text-center text-sm">
                        {t('alreadyHaveAccount')}{' '}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            {tButton('login')}
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
