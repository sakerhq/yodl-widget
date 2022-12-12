import api from './index.js'

export default {
  /**
   *
   * @param {String} payload.username
   * @returns
   */
  user({ username }) {
    return api.get(`/users/${username}`)
  }
}
