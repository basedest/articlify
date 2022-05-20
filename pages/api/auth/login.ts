import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "../../../lib/server/connection"
import { UserModel } from "../../../lib/UserTypes"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const name = req.body.username
        const {password} =req.body
        await connectDB()
        const user = await UserModel.findOne({name})
        if (!user) {
          return res.status(400).json({error: 'invalid username'})
        }
        const isMatch = await user.comparePassword(password)
        if (isMatch) {
          const {name, email, regDate, image, role} = user
          
          return res.status(200).json({name, email, regDate, image, role, id: user._id})
        }
        else {
          return res.status(400).json({error: 'invalid password'})
        }
      }
      catch (e) {
        console.log(e)
        return res.status(400).json({error: 'something horrifying happened...'})
      }
  }
}

export default handler