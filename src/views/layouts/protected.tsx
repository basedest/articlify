import { getLocale } from 'next-intl/server';
import { redirect } from 'i18n/navigation';
import { getSession } from '~/features/auth/auth';

export async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        const locale = await getLocale();
        redirect({ href: '/login', locale });
    }

    const user = session!.user as { emailVerified?: boolean };
    if (user.emailVerified === false) {
        const locale = await getLocale();
        redirect({ href: '/verify-email', locale });
    }

    return <>{children}</>;
}
