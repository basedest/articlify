import {Types} from "mongoose"
import { Article, ArticleModel } from "../../ArticleTypes"
import { connectDB } from "../connection"

class ArticleService {
    async create(article:Article) {
        await connectDB()
        return JSON.parse(
            JSON.stringify(await ArticleModel.create(article))
        ) as Article
    }
    async getAll() {
        await connectDB()
        const articles = await ArticleModel.find()
        return JSON.parse(JSON.stringify(articles)) as Article[]
    }
    async get(query: any, page=0, pagesize=5) {
        if (query.title === undefined) {
            delete query.title
        }
        await connectDB()
        const articles = await ArticleModel.find(
                {
                    ...query,
                    ...query.tags && {tags: {$all: query.tags}},
                    ...query.title && {title: new RegExp(query.title as string, 'i')}
                }, 
                {content: 0}
            )
            .skip(pagesize * (page - 1))
            .limit(pagesize)
            .sort({createdAt:-1})
        return JSON.parse(JSON.stringify(articles)) as Article[]
    }
    async getById(id: Types.ObjectId) {
        await connectDB()
        if (!id) {
            throw new Error('ID not specified')
        }
        const article = await ArticleModel.findById(id)
        return JSON.parse(JSON.stringify(article)) as Article
    }
    async getBySlug(slug:string) {
        await connectDB()
        if (!slug) {
            throw new Error('slug not specified')
        }
        const article = await ArticleModel.findOne({slug})
        return JSON.parse(JSON.stringify(article)) as Article
    }
    async update(article:Article) {
        await connectDB()
        if (!article._id) {
            throw new Error('ID not specified')
        }
        const updatedArticle = await ArticleModel.findByIdAndUpdate(article._id, article, {new: true})
        return JSON.parse(JSON.stringify(updatedArticle)) as Article
    }
    async updateBySlug(article:Article) {
        await connectDB()
        if (!article.slug) {
            throw new Error('slug not specified')
        }
        const updatedArticle = await ArticleModel.findOneAndUpdate({slug: article.slug}, article, {new: true})
        return JSON.parse(JSON.stringify(updatedArticle)) as Article
    }
    async delete(id: Types.ObjectId) {
        await connectDB()
        if (!id) {
            throw new Error('ID not specified')
        }
        const deletedArticle = await ArticleModel.findByIdAndDelete(id)
        return JSON.parse(JSON.stringify(deletedArticle)) as Article
    }
    async deleteBySlug(slug:string) {
        await connectDB()
        if (!slug) {
            throw new Error('slug not specified')
        }
        const deletedArticle = await ArticleModel.findOneAndDelete({slug})
        return JSON.parse(JSON.stringify(deletedArticle)) as Article
    }
}

export default new ArticleService()