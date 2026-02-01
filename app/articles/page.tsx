import { ArticlesPage, generateMetadata as articlesGenerateMetadata } from '~/views/articles';

export const generateMetadata = articlesGenerateMetadata;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    return <ArticlesPage {...props} />;
}
