import { OutputData } from "@editorjs/editorjs"
import { NextApiRequest, NextApiResponse } from "next"
import { Article, ArticleModel, PageModel } from "../../../lib/ArticleTypes"
import { connectDB } from "../../../lib/db/connection"
import findArticles from "../../../lib/db/findArticles"
import { ResponseFuncs } from "../../../lib/lib"

interface PostParams {
  article: Article,
  data: OutputData
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        res.status(200).json(await findArticles(req.query).catch(catcher))
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const {article, data} = req.body as PostParams
      const {slug} = article
      await connectDB().catch(catcher)
      await PageModel.create({slug, data}).catch(catcher)
      res.status(201).json(await ArticleModel.create(article).catch(catcher))
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
}

export default handler