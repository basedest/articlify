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
          res.status(400).json({error: `'${name}' is already taken`})
          return
        }
        user = await UserModel.findOne({email})
        if (user) {
          res.status(400).json({error: 'this email is already taken'})
          return
        }
        user = new UserModel({
          name,
          email,
          password,
          role: 'user',
          regDate: new Date()
        })
        await user.save()
        res.status(201).json(user)
      }
      catch (e) {
        res.status(400).json({error: 'something horrifying happened...'})
        console.log(e)
      }
    }
}

export default handler