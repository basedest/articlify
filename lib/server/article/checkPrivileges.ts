import ArticleService from "./service"

export default async function checkPrivileges(user, slug) {
    const article = await ArticleService.getBySlug(slug)
    if (user.name === article.author 
        || user?.role === 'admin'
    ) {
        return true
    }
    return false
}