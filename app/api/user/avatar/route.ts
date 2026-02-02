import { NextResponse } from 'next/server';
import { auth } from '~/features/auth/auth';
import { connectDB } from '~/shared/lib/server/connection';
import { UserModel } from '~/entities/user/model/types';
import { withApiLogging } from '~/shared/lib/server/with-api-logging';

/** Avatars are stored as http(s) URLs only (S3/MinIO). Redirect to that URL. */
async function getAvatarHandler() {
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

    return new NextResponse(null, { status: 404 });
}

export const GET = withApiLogging(async () => getAvatarHandler());
