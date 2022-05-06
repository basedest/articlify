import mongoose from "mongoose"
import { NextApiRequest, NextApiResponse } from "next"
import { UserModel } from "../../../lib/UserTypes"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const name = req.body.username
        const {password} =req.body
        await mongoose.connect(process.env.MONGODB_URI)
        const user = await UserModel.findOne({name})
        
        if (!user) {
          res.status(400).json({message: 'invalid username'})
          return
        }
        const isMatch = await user.comparePassword(password)
        if (isMatch) {
          res.status(200).json(user)
        }
        else {
          res.status(400).json({message: 'invalid password'})
        }
      }
      catch (e) {
        res.status(400).json(e)
        console.log(e)
      }
    }
}

export default handler