import { CategoryPage, generateMetadata as categoryGenerateMetadata } from '~/views/category';

export const generateMetadata = categoryGenerateMetadata;

interface PageProps {
    params: Promise<{ locale: string; category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    const { category } = await props.params;
    return <CategoryPage params={Promise.resolve({ category })} searchParams={props.searchParams} />;
}
