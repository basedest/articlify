import { Schema, model, models } from 'mongoose'
import bcrypt from "bcryptjs"

export interface User {
    name:       string
    email:      string
    password:   string
    regDate:    Date
    avatar?:    string
    articles?:  Array<string>
}

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
    avatar: String,
    articles: [String]
})

UserSchema.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })
  
  UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password)
  }

export const UserModel = models.User || model<User>('User', UserSchema)