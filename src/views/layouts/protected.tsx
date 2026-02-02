import { getLocale } from 'next-intl/server';
import { redirect } from '~/i18n/navigation';
import { auth } from '~/auth';

export async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        const locale = await getLocale();
        redirect({ href: '/login', locale });
    }

    return <>{children}</>;
}
