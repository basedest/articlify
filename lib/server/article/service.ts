import { Article, ArticleModel } from "../../ArticleTypes"

class ArticleService {
    async create(article:Article) {
        return ArticleModel.create(article)
    }
    async getAll() {
        return ArticleModel.find()
    }
    async get(query: any, page?: number, pagesize?: number) {
        return ArticleModel.find(
                {
                    ...query,
                    tags: {$all: query.tags},
                    title: new RegExp(query.title as string, 'i')
                }, 
                {content: 0}
            )
            .skip(page ? pagesize * (page - 1) : 0)
            .limit(pagesize ?? 5)
            .sort({createdAt:-1})
    }
    async getById(id) {
        if (!id) {
            throw new Error('ID not specified')
        }
        return ArticleModel.findById(id)
    }
    async getBySlug(slug:string) {
        if (!slug) {
            throw new Error('slug not specified')
        }
        return ArticleModel.findOne({slug})
    }
    async update(article:Article) {
        if (!article._id) {
            throw new Error('ID not specified')
        }
        return ArticleModel.findByIdAndUpdate(article._id, article, {new: true})
    }
    async updateBySlug(article:Article) {
        if (!article.slug) {
            throw new Error('slug not specified')
        }
        return ArticleModel.findOneAndUpdate({slug: article.slug}, article, {new: true})
    }
    async delete(id) {
        if (!id) {
            throw new Error('ID not specified')
        }
        return ArticleModel.findByIdAndDelete(id)
    }
    async deleteBySlug(slug:string) {
        if (!slug) {
            throw new Error('slug not specified')
        }
        return ArticleModel.findOneAndDelete({slug})
    }
}

export default new ArticleService()
