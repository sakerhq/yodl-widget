import api from './index.js'

export default {
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
   * @param {String} payload.email
   * @param {Number} payload.priceId
   * @param {String} payload.scheduledOn YYYY-MM-DD
   * @param {String} payload.scheduledTime HH:mm
   * @param {String} payload.timeZone
   * @param {String} payload.type
   */
  requestPaymentIntent(payload) {
    return api.post('/billing/payment_intents', payload)
  },
  /**
   *
   * @param {*} data
   */
  bookInteraction(data) {
    return api.post('/booking/bookings/', data)
  }
}
