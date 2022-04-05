import { Schema, model, models } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
export interface User {
    uName:      string
    name:       string
    email:      string
    regDate:    Date
    avatar?:    string
    articles?:  Array<string>
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<User>({
    uName: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    regDate: {
        type: Date,
        required: true
    },
    avatar: String,
    articles: [String]
})

// 3. Create a Model.
export const UserModel = models.User || model<User>('User', schema)