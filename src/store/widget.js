import { defineStore } from 'pinia'

export const useWidgetStore = defineStore('widget', {
  state: () => ({
    availabilities: [],
    date: null,
    duration: null,
    email: null,
    name: null,
    product: null,
    time: null
  }),
  getters: {},
  actions: {}
})
