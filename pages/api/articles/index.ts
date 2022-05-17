import { NextApiRequest, NextApiResponse } from "next"
import { ResponseFuncs } from "../../../lib/lib"
import ArticleController from "../../../lib/server/article/controller"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  const handleCase: ResponseFuncs = {
    GET: ArticleController.get,
    POST: ArticleController.create,
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  return res.status(400).json({ error: "No Response for This Request" })
}

export default handler