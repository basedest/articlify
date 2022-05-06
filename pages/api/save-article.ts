import { OutputData } from "@editorjs/editorjs"
import mongoose from "mongoose"
import { NextApiRequest, NextApiResponse } from "next"
import { Article, ArticleModel, PageModel } from "../../lib/ArticleTypes"

interface Params {
    article: Article,
    data: OutputData
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {article, data} = req.body as Params
    const {slug} = article
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      await PageModel.create({slug, data})
      await ArticleModel.create(article)
    }
    catch (error) {
      res.status(400).json(error)
      return
    }
    res.status(201).json({message: 'success'})
  }
}

export default handler