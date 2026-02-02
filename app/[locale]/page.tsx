import { HomePage } from '~/views/home';

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    return <HomePage searchParams={props.searchParams} />;
}
