const pjson = require('../package.json')

export interface ResponseFuncs {
    GET?:    Function
    POST?:   Function
    PATCH?:  Function
    PUT?:    Function
    DELETE?: Function
}

export const {version} = pjson

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