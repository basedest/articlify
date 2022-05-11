import { User } from "../UserTypes"

export default function checkPriveleges(user: User, author: string): boolean {
    if (!user) return false
    if (user.name === author || user.role === 'admin') return true
    return false
}