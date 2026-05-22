import Link from 'next/link';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';

// This file only renders when the request is outside the [locale] segment
// (e.g. a static asset miss). The localized variant in app/[locale]/not-found.tsx
// handles in-app 404s. Bilingual fallback to avoid an English-only leak.
export default function RootNotFound() {
    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle className="text-4xl">404</CardTitle>
                    <CardDescription className="text-lg">Page Not Found / Страница не найдена</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        The page you are looking for doesn&apos;t exist or has been moved. / Запрашиваемая страница не
                        существует или была перемещена.
                    </p>
                    <Button asChild>
                        <Link href="/">Go Home / На главную</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
