import {
    ArticlePage,
    generateMetadata as articleGenerateMetadata,
    generateStaticParams as articleGenerateStaticParams,
} from '~/views/article';
import { routing } from '~/i18n/routing';

export const revalidate = 30;
export const generateMetadata = articleGenerateMetadata;

export async function generateStaticParams() {
    const baseParams = await articleGenerateStaticParams();
    return routing.locales.flatMap((locale) => baseParams.map((p) => ({ locale, category: p.category, slug: p.slug })));
}

interface PageProps {
    params: Promise<{ locale: string; category: string; slug: string }>;
}

export default async function Page(props: PageProps) {
    const { category, slug } = await props.params;
    return <ArticlePage params={Promise.resolve({ category, slug })} />;
}
