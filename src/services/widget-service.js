import api from './api-service.js'

export default {
  getUser(username) {
    return api.get('/users/' + username)
  },
  getAvailabilities(optionsObj) {
    return api.get('/widget/availabilities/', { params: optionsObj })
  },
  bookInteraction(data) {
    return api.post('/widget/bookings/', data)
  }
}