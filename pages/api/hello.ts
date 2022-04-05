// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { mongocon } from '../../lib/lib'

type Data = {
  data: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: string = process.env.MONGODB_URI
  res.status(200).json({ data })
}
