import { Schema, model, models, Types } from 'mongoose'
import bcrypt from "bcryptjs"

//тип данных: пользователь
export interface User {
    name:       string
    email:      string
    password:   string
    regDate:    Date
    role?:      string
    image?:     string
    id?:        Types.ObjectId
}

//схема данных для БД
const UserSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    regDate: {
        type: Date,
        required: true
    },
    role: String,
    image: String,
})

//перед сохранением пользователя в БД, хешируем пароль
UserSchema.pre("save", async function () {
    //при изменении или новом пароле
    if (this.isModified("password") || this.isNew) {
      //генерируем соль и хешируем пароль
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
})

//сравнение паролей криптографически
UserSchema.methods.comparePassword = async function(password:string) {
  return bcrypt.compare(password, this.password)
}

export const UserModel = models.User || model<User>('User', UserSchema)
