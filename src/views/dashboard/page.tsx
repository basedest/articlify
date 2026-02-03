import { getSession } from '~/features/auth/auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'i18n/navigation';
import { Link } from 'i18n/navigation';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { AvatarEditor } from '~/features/avatar/upload/ui/avatar-editor';
import { Separator } from '~/shared/ui/separator';
import { CalendarDays, Mail, UserCircle } from 'lucide-react';

export async function DashboardPage() {
    const session = await getSession();

    if (!session || !session.user) {
        const locale = await getLocale();
        redirect({ href: '/login', locale });
    }

    const user = session!.user;
    const t = await getTranslations('dashboard');

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile')}</CardTitle>
                        <CardDescription>{t('profileDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <AvatarEditor />

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="text-muted-foreground h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            {user.regDate && (
                                <div className="flex items-center gap-2 text-sm">
                                    <CalendarDays className="text-muted-foreground h-4 w-4" />
                                    <span>
                                        {t('memberSince')} {new Date(user.regDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <Button variant="outline" className="w-full" asChild>
                            <Link href={`/articles/user/${user.name}`}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                {t('viewYourArticles')}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('quickActions')}</CardTitle>
                        <CardDescription>{t('manageContent')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full" asChild>
                            <Link href="/editor">{t('createNewArticle')}</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href={`/articles/user/${user.name}`}>{t('manageArticles')}</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">{t('browseArticles')}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
