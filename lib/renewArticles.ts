import { ArticleModel, PageModel } from "./ArticleTypes"

export default async function renewArticles() {
    let articles = await ArticleModel.find({})
    for (let article of articles) {
        if (!article.content) {
            const page = await PageModel.findOne({slug: article.slug})
            if (page) { 
                article.content = page.data
                article.save()
            }
        }
    }
}