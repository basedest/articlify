import { NextResponse } from 'next/server';
import { connectDB } from '~/shared/lib/server/connection';
import { UserModel } from '~/entities/user/model/types';
import { withApiLogging } from '~/shared/lib/server/with-api-logging';

/** Public: redirect to a user's avatar image by username. Avatars are stored as http(s) URLs (S3/MinIO). */
async function getAvatarByUsernameHandler(
    _req: Request,
    _logContext: { requestId: string; traceId?: string },
    username: string,
) {
    if (!username) {
        return new NextResponse(null, { status: 404 });
    }

    await connectDB();
    const user = await UserModel.findOne({ name: username }).select('image').lean();
    if (!user?.image) {
        return new NextResponse(null, { status: 404 });
    }

    const image = user.image as string;
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return NextResponse.redirect(image);
    }

    return new NextResponse(null, { status: 404 });
}

export const GET = async (req: Request, routeContext: { params: Promise<{ username: string }> }) => {
    const { username } = await routeContext.params;
    const wrapped = withApiLogging((r, ctx) => getAvatarByUsernameHandler(r, ctx, username));
    return wrapped(req);
};
