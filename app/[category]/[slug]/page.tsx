import {
    ArticlePage,
    generateMetadata as articleGenerateMetadata,
    generateStaticParams as articleGenerateStaticParams,
} from '~/views/article';

export const revalidate = 30;
export const generateMetadata = articleGenerateMetadata;
export const generateStaticParams = articleGenerateStaticParams;

interface PageProps {
    params: Promise<{ category: string; slug: string }>;
}

export default async function Page(props: PageProps) {
    return <ArticlePage {...props} />;
}
