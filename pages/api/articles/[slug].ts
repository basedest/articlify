import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { ResponseFuncs } from "../../../lib/lib"
import { User } from "../../../lib/UserTypes"
import checkPrivileges from "../../../lib/server/article/checkPrivileges"
import ArticleController from "../../../lib/server/article/controller"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //auth logic
  const slug = req.query.slug as string
  const session = await getSession({ req })
  const user = session?.user as User
  if (!(await checkPrivileges(user, slug))) {
    return res.status(403).json({error: 'forbidden action'})
  }

  const handleCase: ResponseFuncs = {
    PUT: ArticleController.update,
    DELETE: ArticleController.delete  
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
}

export default handler