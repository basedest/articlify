import mongoose from 'mongoose';
import { getServerConfig } from '~/shared/config/env/server';
import { log } from '~/shared/lib/server/logger';

export const connectDB = async () => {
    try {
        return await mongoose.connect(getServerConfig().mongodb.uri);
    } catch (err) {
        log({
            level: 'fatal',
            message: 'mongodb connection failed',
            extra: { error: err instanceof Error ? err.message : String(err) },
        });
        throw err;
    }
};
