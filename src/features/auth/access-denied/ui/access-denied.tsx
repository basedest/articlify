import Link from 'next/link';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { ShieldAlert } from 'lucide-react';

export function AccessDenied({ callbackUrl }: { callbackUrl: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="max-w-md">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <ShieldAlert className="text-destructive h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>You need to be signed in to view this page</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button asChild>
                        <Link href={`/login/?callbackUrl=${callbackUrl}`}>Sign In</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
