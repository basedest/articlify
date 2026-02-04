import { Link } from 'i18n/navigation';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
    const t = await getTranslations('common');
    const tButton = await getTranslations('button');

    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle className="text-4xl">404</CardTitle>
                    <CardDescription className="text-lg">{t('pageNotFound')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{t('pageNotFoundDescription')}</p>
                    <Button asChild>
                        <Link href="/">{tButton('goHome')}</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
