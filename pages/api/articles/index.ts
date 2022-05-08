import { NextApiRequest, NextApiResponse } from "next"
import { ArticleModel } from "../../../lib/ArticleTypes"
import { connectDB } from "../../../lib/connection"
import { ResponseFuncs } from "../../../lib/lib"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        await connectDB() // connect to database
        const params = {...req.query}
        const {tags, title} = req.query
        delete params.tags
        delete params.title
        if (tags) {
            params.tags = {$all: tags} as any
        }
        if (title) {
            params.title = new RegExp(title as string, 'i') as any
        }
        res.status(200).json(await ArticleModel.find(params).catch(catcher))
    },
    // RESPONSE POST REQUESTS
    // POST: async (req: NextApiRequest, res: NextApiResponse) => {
    //     await connectDB()
    //   res.status(201).json(await ArticleModel.create(req.body).catch(catcher))
    // },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler