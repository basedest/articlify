import { ProtectedLayout } from '~/views/layouts/protected';

export default async function Layout({ children }: { children: React.ReactNode }) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
