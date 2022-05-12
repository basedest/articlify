import { NextApiRequest, NextApiResponse } from "next"
import { version } from "../../lib/lib"

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      return res.status(200).json({version})
    }
    return res.status(400).json({ error: "No Response for This Request" })
}