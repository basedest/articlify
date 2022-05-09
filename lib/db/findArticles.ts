import { ArticleModel } from "../ArticleTypes"
import { connectDB } from "../connection"

const findArticles = async (query) => {
    await connectDB() // connect to database
    console.log(query);
    
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
    const res = await ArticleModel.find(params)
    return JSON.parse(JSON.stringify(res))
}

export default findArticles