import { UserArticlesPage, generateMetadata as userArticlesGenerateMetadata } from '~/views/user-articles';

export const generateMetadata = userArticlesGenerateMetadata;

interface PageProps {
    params: Promise<{ locale: string; author: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    const { author } = await props.params;
    return <UserArticlesPage params={Promise.resolve({ author })} searchParams={props.searchParams} />;
}
