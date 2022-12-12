import axios from 'axios'
import keysToCamelCase from '../utils/keys-to-camel-case'
import keysToSnakeCase from '../utils/keys-to-snake-case'

const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL })

api.defaults.headers.common['Accept'] = 'application/json'

api.interceptors.request.use(
  function (config) {
    config.params = keysToSnakeCase(config.params)
    config.data = keysToSnakeCase(config.data)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  function (response) {
    response.data = keysToCamelCase(response.data)
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default api
