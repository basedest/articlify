import { HomePage } from '~/views/home';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
    return <HomePage {...props} />;
}
