import { NextApiRequest, NextApiResponse } from "next"
import ArticleService from "./service"

class ArticleController {
    async create(req: NextApiRequest, res: NextApiResponse) {
        try {
            const article = await ArticleService.create(req.body)
            return res.json(article)
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            const {query, page, pagesize} = req.body
            const articles = await ArticleService.get(query, page, pagesize)
            return res.json(articles)
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async getOne(req: NextApiRequest, res: NextApiResponse) {
        try {
            const article = await ArticleService.getBySlug(req.query.slug as string)
            return res.json(article)
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async update(req: NextApiRequest, res: NextApiResponse) {
        try {
            const article = await ArticleService.updateBySlug(req.body)
            return res.json(article)
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async delete(req: NextApiRequest, res: NextApiResponse) {
        try {
            const article = await ArticleService.deleteBySlug(req.query.slug as string)
            return res.json(article)
        } catch (e) {
            res.status(400).json(e)
        }
    }
}

export default new ArticleController()