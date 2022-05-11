const pjson = require('../package.json')

//функции ответа от сервера для API
export interface ResponseFuncs {
    GET?:    Function
    POST?:   Function
    PATCH?:  Function
    PUT?:    Function
    DELETE?: Function
}

//версия приложения
export const {version} = pjson

//категории статей
export const categories = [
    'art',
    'it',
    'games',
    'music',
    'science',
    'sports',
    'travel',
    'movies',
    'other'
]