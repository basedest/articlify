import { userRepository } from '~/entities/user/api/user.repository';
import { TRPCError } from '@trpc/server';

export class UserService {
    async findById(id: string) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        return user;
    }

    async register(data: { name: string; email: string; password: string }) {
        const existingByName = await userRepository.findByName(data.name);
        if (existingByName) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Username already exists',
            });
        }

        const existingByEmail = await userRepository.findByEmail(data.email);
        if (existingByEmail) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Email already exists',
            });
        }

        return await userRepository.create(data);
    }

    async updateAvatar(id: string, imageUrl: string) {
        const user = await userRepository.updateById(id, { image: imageUrl });
        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        return user;
    }

    async updatePreferredLanguage(id: string, locale: string) {
        const user = await userRepository.updateById(id, { preferredLanguage: locale });
        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        return user;
    }
}

export const userService = new UserService();
