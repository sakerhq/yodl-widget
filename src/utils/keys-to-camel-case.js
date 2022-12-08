import { camelCase } from 'lodash'

const keysToCamelCase = (o) => {
  if (isObject(o)) {
    const n = {}
    Object.keys(o).forEach((k) => {
      n[camelCase(k)] = keysToCamelCase(o[k])
    })
    return n
  } else if (isArray(o)) {
    return o.map(i => keysToCamelCase(i))
  }
  return o
}

export default keysToCamelCase

const isArray = a => Array.isArray(a)
const isObject = o => o === Object(o) && !isArray(o) && typeof o !== 'function'
