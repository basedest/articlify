import { Schema, model, models, Types } from 'mongoose'
import bcrypt from "bcryptjs"

//user data type
export interface User {
    name:       string
    email:      string
    password:   string
    regDate:    Date
    role?:      string
    image?:     string
    id?:        Types.ObjectId
}

//schema for DB
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

//before saving user to DB, hash password
UserSchema.pre("save", async function () {
    //if password is modified or new
    if (this.isModified("password") || this.isNew) {
      //generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
})

//compare passwords cryptographically
UserSchema.methods.comparePassword = async function(password:string) {
  return bcrypt.compare(password, this.password)
}

export const UserModel = models.User || model<User>('User', UserSchema)
