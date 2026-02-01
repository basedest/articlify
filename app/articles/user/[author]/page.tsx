import { UserArticlesPage, generateMetadata as userArticlesGenerateMetadata } from '~/views/user-articles';

export const generateMetadata = userArticlesGenerateMetadata;

interface PageProps {
    params: Promise<{ author: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    return <UserArticlesPage {...props} />;
}
