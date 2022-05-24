import { User } from "../../UserTypes"
import ArticleService from "./service"

export default async function checkPrivileges(user: User, slug: string) {
    const article = await ArticleService.getBySlug(slug)
    if (user.name === article.author 
        || user?.role === 'admin'
    ) {
        return true
    }
    return false
}