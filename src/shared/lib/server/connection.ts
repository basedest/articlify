import mongoose from 'mongoose';
import { getServerConfig } from '~/shared/config/env/server';

export const connectDB = async () => {
    const conn = await mongoose.connect(getServerConfig().mongodb.uri).catch((err) => console.log(err));

    return conn;
};
