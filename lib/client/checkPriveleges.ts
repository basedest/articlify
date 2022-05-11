import { User } from "../UserTypes"

//проверка права на редактирование и удаление
export default function
checkPriveleges(user: User, author: string): boolean {
    if (!user) return false
    if (user.name === author || user.role === 'admin') return true
    return false
}