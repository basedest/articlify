import { CategoryPage, generateMetadata as categoryGenerateMetadata } from '~/views/category';

export const generateMetadata = categoryGenerateMetadata;

interface PageProps {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    return <CategoryPage {...props} />;
}
