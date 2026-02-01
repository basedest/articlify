import Link from 'next/link';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';

export default function NotFound() {
    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle className="text-4xl">404</CardTitle>
                    <CardDescription className="text-lg">Page Not Found</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        The page you are looking for doesn&apos;t exist or has been moved.
                    </p>
                    <Button asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
