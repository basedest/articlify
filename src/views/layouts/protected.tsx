import { getLocale } from 'next-intl/server';
import { redirect } from 'i18n/navigation';
import { getSession } from '~/features/auth/auth';

export async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        const locale = await getLocale();
        redirect({ href: '/login', locale });
    }

    return <>{children}</>;
}
