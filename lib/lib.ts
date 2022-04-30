const pjson = require('../package.json')

export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
}

export const {version} = pjson