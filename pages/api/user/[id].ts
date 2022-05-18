import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { ResponseFuncs } from "../../../lib/lib"
import { User, UserModel } from "../../../lib/UserTypes"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  const catcher = (error: Error) => res.status(400).json({ error })

  const id: string = req.query.id as string

  const session = await getSession({ req })
  const user = session.user as User
  if (user.id.toString() !== id) {
    return res.status(403).json({error: 'permission denied'})
  }

  const handleCase: ResponseFuncs = {
    //изменение аватарки
    PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
      const {image} = req.body
      await UserModel.findByIdAndUpdate(id, {image}).catch(catcher)
      return res.status(200).json({image})
    },
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for this Request" })
}

export default handler