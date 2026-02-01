import { UserModel, type User } from '~/entities/user/model/types';
import { connectDB } from '~/shared/lib/server/connection';
import { Types } from 'mongoose';

export class UserRepository {
    async findById(id: string) {
        await connectDB();
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        const user = await UserModel.findById(id).select('-password').lean();
        return user ? (JSON.parse(JSON.stringify(user)) as Omit<User, 'password'>) : null;
    }

    async findByName(name: string) {
        await connectDB();
        const user = await UserModel.findOne({ name }).lean();
        return user ? (JSON.parse(JSON.stringify(user)) as User) : null;
    }

    async findByEmail(email: string) {
        await connectDB();
        const user = await UserModel.findOne({ email }).lean();
        return user ? (JSON.parse(JSON.stringify(user)) as User) : null;
    }

    async create(userData: { name: string; email: string; password: string; role?: string }) {
        await connectDB();
        const user = await UserModel.create({
            ...userData,
            regDate: new Date(),
            role: userData.role || 'user',
        });
        const userObject = user.toObject();
        delete userObject.password;
        return JSON.parse(JSON.stringify(userObject)) as Omit<User, 'password'>;
    }

    async updateById(id: string, update: Partial<User>) {
        await connectDB();
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        const user = await UserModel.findByIdAndUpdate(id, update, {
            new: true,
        })
            .select('-password')
            .lean();
        return user ? (JSON.parse(JSON.stringify(user)) as Omit<User, 'password'>) : null;
    }
}

export const userRepository = new UserRepository();
