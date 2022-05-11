import { ArticleModel } from "../ArticleTypes"
import { connectDB } from "./connection"

//поиск статей в БД
const findArticles = async (query) => {
    await connectDB() // подключение к БД
    const params = {...query}
    const {tags, title} = query
    delete params.tags
    delete params.title
    /*
        если передавать теги как есть, то СУБД будет искать только те записи,
        в которых список тегов *полностью* совпадает с нашим,
        здесь указывается, чтобы СУБД искала статьи со списком тегов,
        включающем все переданные нами теги, но там могут быть и другие
    */
    if (tags) {
        params.tags = {$all: tags} as any
    }
    //ищем название не по полному совпадению, а частичному - через РВ
    if (title) {
        params.title = new RegExp(title as string, 'i') as any
    }
    let res = null
    //если указана страница
    if (params.page) {
        //размер страницы, если не указан в запросе равен 5
        const pagesize = params.pagesize ?? 5
        //сколько записей нужно пропустить, чтобы дойти до нужной страницы
        const skips = pagesize * (params.page - 1)
        res = await ArticleModel
            .find(params)
            .skip(skips)
            .limit(pagesize)
            .sort({createdAt:-1})
    }
    //иначе выводим всё
    else {
        res = await ArticleModel
        .find(params)
        .sort({createdAt:-1})
    }
    return JSON.parse(JSON.stringify(res))
}

export default findArticles