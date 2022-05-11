import { OutputData } from "@editorjs/editorjs"
import { NextApiRequest, NextApiResponse } from "next"
import { Article, ArticleModel, PageModel } from "../../../lib/ArticleTypes"
import { connectDB } from "../../../lib/db/connection"
import findArticles from "../../../lib/db/findArticles"
import { ResponseFuncs } from "../../../lib/lib"

interface PostParams {
  article: Article,
  data: OutputData
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //определяем метод запроса
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //функция для перехвата ошибок
  const catcher = (error: Error) => res.status(400).json({ error })

  // возможные ответы сервера
  const handleCase: ResponseFuncs = {
    // ответ на GET-запрос
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        res.status(200).json(await findArticles(req.query).catch(catcher))
    },
    // ответ на POST-запрос
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const {article, data} = req.body as PostParams
      const {slug} = article
      await connectDB().catch(catcher)
      await PageModel.create({slug, data}).catch(catcher)
      res.status(201).json(await ArticleModel.create(article).catch(catcher))
    },
  }

  // Проверка, есть ли ответ на текущий метод
  const response = handleCase[method]
  // если есть, вызвать его
  if (response) return response(req, res)
  //иначе, отправить ответ с сообщением об ошибке
  return res.status(400).json({ error: "No Response for This Request" })
}

export default handler