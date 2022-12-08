import { snakeCase } from 'lodash'

const keysToSnakeCase = (o) => {
  if (isObject(o)) {
    const n = {}
    Object.keys(o).forEach((k) => {
      n[snakeCase(k)] = keysToSnakeCase(o[k])
    })
    return n
  } else if (isArray(o)) {
    return o.map(i => keysToSnakeCase(i))
  }
  return o
}

export default keysToSnakeCase

const isArray = a => Array.isArray(a)
const isObject = o => o === Object(o) && !isArray(o) && typeof o !== 'function'
