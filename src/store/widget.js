import { defineStore } from 'pinia'
import WidgetAPI from '@/api/widget.js'

export const useWidgetStore = defineStore('widget', {
  state: () => ({
    availabilities: [],
    date: null,
    duration: null,
    email: null,
    name: null,
    product: null,
    time: null,
    user: null,
    timeZone: null
  }),
  actions: {
    /**
     * Get availabilities
     * @param {Number} payload.priceId
     * @param {String} payload.startDate  YYYY-MM-DD
     * @param {String} payload.endDate  YYYY-MM-DD
     * @param {String} payload.timeZone
     */
    async getAvailabilities({ priceId, startDate, endDate, timeZone }) {
      const {
        data: { availabilities }
      } = await WidgetAPI.availabilities({ priceId, startDate, endDate, timeZone })

      this.availabilities = availabilities
    }
  }
})
