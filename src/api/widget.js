import api from './index.js'

export default {
  /**
   *
   * @param {String} payload.username
   */
  user({ username }) {
    return api.get(`/users/${username}`)
  },
  /**
   * Get availabilities
   * @param {Number} payload.priceId
   * @param {String} payload.startDate  YYYY-MM-DD
   * @param {String} payload.endDate  YYYY-MM-DD
   * @param {String} payload.timeZone
   */
  availabilities(payload) {
    return api.get('/booking/availabilities/', { params: payload })
  },
  /**
   *
   * @param {*} data
   */
  bookInteraction(data) {
    return api.post('/booking/bookings/', data)
  }
}
