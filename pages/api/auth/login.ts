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
          res.status(400).json({error: 'invalid username'})
          return
        }
        const isMatch = await user.comparePassword(password)
        if (isMatch) {
          const {name, email, regDate, image, role} = user
          
          res.status(200).json({name, email, regDate, image, role, id: user._id})
        }
        else {
          res.status(400).json({error: 'invalid password'})
        }
      }
      catch (e) {
        res.status(400).json({error: 'something horrifying happened...'})
        console.log(e)
      }
  }
}

export default handler