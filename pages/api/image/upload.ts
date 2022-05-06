import formidable from "formidable"
import fs from "fs/promises"

export const config = {
  api: {
    bodyParser: false
  }
}

const allowedExtensions = ['jpg', 'png', 'gif', 'webp']

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({error: err})
    const {file} = files

    if (!file) {
      return res.status(400).json({error: 'ivalid file'})
    }

    const data = await fs.readFile(file.filepath)
    const fileExtension = /(?:\.([^.]+))?$/.exec(file.originalFilename)[1]

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({error: 'file extension not allowed'})
    }
    
    const filename = `/img/${file.newFilename}.${fileExtension}`
    await fs.writeFile(`./public${filename}`, data)
    await fs.unlink(file.filepath)

    return res.status(201).json({filename})
    })
    res.status(300)
  } else {
    res.status(400).json({error: 'something horrifying happened...'})
  }
}

export default handler