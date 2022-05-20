import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "../../../lib/server/connection"
import { UserModel } from "../../../lib/UserTypes"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const {name, email, password} = req.body
        await connectDB()
        let user = await UserModel.findOne({name})
        if (user) {         
          return res.status(400).json({error: `'${name}' is already taken`})
        }
        user = await UserModel.findOne({email})
        if (user) {
          return res.status(400).json({error: 'this email is already taken'})
        }
        user = new UserModel({
          name,
          email,
          password,
          role: 'user',
          regDate: new Date()
        })
        await user.save()
        return res.status(201).json(user)
      }
      catch (e) {
        console.log(e)
        return res.status(400).json({error: 'something horrifying happened...'})
      }
    }
}

export default handler