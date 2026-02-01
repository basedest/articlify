import { NextResponse } from 'next/server';
import pjson from '../../../package.json';
import { withApiLogging } from '~/shared/lib/server/with-api-logging';

const getHandler = async () => {
    return NextResponse.json({ version: pjson.version });
};

export const GET = withApiLogging(async (req) => getHandler());
