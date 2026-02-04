import { NextResponse } from 'next/server';
import { getSession } from '~/features/auth/auth';
import { connectDB } from '~/shared/lib/server/connection';
import { UserModel } from '~/entities/user/model/types';
import { withApiLogging } from '~/shared/lib/server/with-api-logging';

/** Avatars are stored as http(s) URLs only (S3/MinIO). Redirect to that URL. */
async function getAvatarHandler() {
    const session = await getSession();
    if (!session?.user?.id) {
        return new NextResponse(null, { status: 401 });
    }

    const authImage = session.user.image;
    if (authImage && (authImage.startsWith('http://') || authImage.startsWith('https://'))) {
        return NextResponse.redirect(authImage);
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

    return new NextResponse(null, { status: 404 });
}

export const GET = withApiLogging(async () => getAvatarHandler());
