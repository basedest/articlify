import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import { connectDB } from '~/lib/server/connection';
import { UserModel } from '~/lib/UserTypes';

/** Avatars are stored as http(s) URLs only (S3/MinIO). Redirect to that URL. */
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse(null, { status: 401 });
    }

    await connectDB();
    const user = await UserModel.findById(session.user.id).select('image').lean();
    if (!user?.image) {
        return new NextResponse(null, { status: 404 });
    }

    const image = user.image as string;
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return NextResponse.redirect(image);
    }

    // Legacy or invalid: only URLs are supported
    return new NextResponse(null, { status: 404 });
}
