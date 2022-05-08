import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "../../../lib/connection"
import { ResponseFuncs } from "../../../lib/lib"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  const catcher = (error: Error) => res.status(400).json({ error })

  const id: string = req.query.id as string

  const handleCase: ResponseFuncs = {
    // GET: async (req: NextApiRequest, res: NextApiResponse) => {
    //   const { Todo } = await connect() // connect to database
    //   res.json(await Todo.findById(id).catch(catcher))
    // },
    PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
      await connectDB()
      //TODO: auth-protected User Model Query
    },
    // DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
    //   const { Todo } = await connect() // connect to database
    //   res.json(await Todo.findByIdAndRemove(id).catch(catcher))
    // },
  }

  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler