import mongoose from "mongoose"
import { NextApiRequest, NextApiResponse } from "next"
import { UserModel } from "../../../lib/UserTypes"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        await mongoose.connect(process.env.MONGODB_URI)
        const user = new UserModel({
          name: req.body.username,
          email: req.body.email,
          password: req.body.password,
          regDate: new Date()
        })
        await user.save()
        res.status(200).json({message: 'success'})
      }
      catch (e) {
        res.status(400).json(e)
        console.log(e)
      }
    }
}

export default handler