import { getSession } from '~/features/auth/auth';
import { maskEmail } from '~/shared/lib/mask-email';
import { VerifyEmailPage } from '~/views/verify-email';

export default async function Page() {
    const session = await getSession();
    const email = session?.user?.email;
    const maskedEmail = email ? maskEmail(email) : null;
    return <VerifyEmailPage maskedEmail={maskedEmail} />;
}
