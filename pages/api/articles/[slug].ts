import { OutputData } from "@editorjs/editorjs"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { Article, ArticleModel } from "../../../lib/ArticleTypes"
import { connectDB } from "../../../lib/server/connection"
import { ResponseFuncs } from "../../../lib/lib"
import { User } from "../../../lib/UserTypes"

interface PutParams {
  article: Article
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  const catcher = (error: Error) => res.status(400).json({ error })
  const slug: string = req.query.slug as string
  const session = await getSession({ req })
  const user = session.user as User

  const handleCase: ResponseFuncs = {
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      
      const {article} = req.body as PutParams
      
      const {slug} = article
      if (user.name !== article.author 
        && user?.role !== 'admin'
      ) {
        res.status(403).json({error: 'forbidden action'})
        return
      }
      await connectDB().catch(catcher)
      await ArticleModel.replaceOne({slug}, article).catch(catcher)
      res.status(200).json({message: 'success'})
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      await connectDB().catch(catcher)
      const article = await ArticleModel.findOne({slug}).catch(catcher)
      if (user.name !== article.author 
        && user?.role !== 'admin'
      ) {
        res.status(403).json({error: 'forbidden action'})
        return
      }
      await ArticleModel.deleteOne({slug}).catch(catcher)
      res.status(200).json({message: 'success'})
    }  
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
}

export default handler