import { OutputData } from "@editorjs/editorjs"
import { NextApiRequest, NextApiResponse } from "next"
import { Article } from "../../lib/ArticleTypes"

interface Params {
    info: Article,
    data: OutputData
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    
  }
}

export default handler