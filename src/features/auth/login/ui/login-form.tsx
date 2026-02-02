'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Link } from 'i18n/navigation';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Alert, AlertDescription } from '~/shared/ui/alert';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '~/features/i18n';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const t = useTranslations('auth');
    const tForm = useTranslations('form');
    const tButton = useTranslations('button');
    const tError = useTranslations('error');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                username: formData.username,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(tError('invalidCredentials'));
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError(tError('generic'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">{t('loginTitle')}</CardTitle>
                        <CardDescription>{t('loginDescription')}</CardDescription>
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
                            placeholder={tForm('placeholderUsername')}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{tForm('password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={tForm('placeholderPassword')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('loggingIn')}
                            </>
                        ) : (
                            tButton('login')
                        )}
                    </Button>

                    <p className="text-muted-foreground text-center text-sm">
                        {t('dontHaveAccount')}{' '}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            {tButton('register')}
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
