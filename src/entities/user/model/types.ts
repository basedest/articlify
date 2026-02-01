import { Schema, model, models, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface User {
    name: string;
    email: string;
    password: string;
    regDate: Date;
    role?: string;
    image?: string;
    id?: Types.ObjectId;
}

const UserSchema = new Schema<User>({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    regDate: { type: Date, required: true },
    role: String,
    image: String,
});

UserSchema.pre('save', async function () {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

UserSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

export const UserModel = models.User || model<User>('User', UserSchema);
