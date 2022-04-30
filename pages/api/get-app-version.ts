import { NextApiRequest, NextApiResponse } from "next"
import { version } from "../../lib/lib"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      res.status(200).json({version})
    }
}

export default handler