import { ArticleModel } from "../ArticleTypes"
import { connectDB } from "../connection"

const findArticles = async (query) => {
    await connectDB() // connect to database
    const params = {...query}
    const {tags, title} = query
    delete params.tags
    delete params.title
    if (tags) {
        params.tags = {$all: tags} as any
    }
    if (title) {
        params.title = new RegExp(title as string, 'i') as any
    }
    let res = null
    if (params.page) {
        const pagesize = params.pagesize ?? 5
        const skips = pagesize * (params.page - 1)
        res = await ArticleModel
            .find(params)
            .skip(skips)
            .limit(pagesize)
            .sort({createdAt:-1})
    }
    else {
        res = await ArticleModel
        .find(params)
        .sort({createdAt:-1})
    }
    return JSON.parse(JSON.stringify(res))
}

export default findArticles