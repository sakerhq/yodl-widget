import { createApp } from 'vue'
import App from './App.vue'
import { LAYOUT_TYPE } from '@/utils/constants'
import { createPinia } from 'pinia'
import '@/assets/index.scss'

window.YodlWidget = {
  app: null,
  options: {
    id: 'yodl-widget',
    layout: LAYOUT_TYPE.default,
    username: null
  },
  init: function (options) {
    Object.assign(this.options, options)

    // NOTE: Render root element
    const root = document.createElement('div')
    root.id = this.options.id
    document.body.appendChild(root)

    this.mount()
  },
  mount: function () {
    const root = document.getElementById(this.options.id)

    if (root) {
      const pinia = createPinia()
      this.app = createApp(App)
      this.app.use(pinia)
      this.app.mount(root)
      document.body.classList.add('yw-freeze-body')
    } else {
      throw new Error(`[ERROR] - Unable to detect root element with id "${this.options.id}"`)
    }
  },
  unmount: function () {
    this.app.unmount()
    document.body.classList.remove('yw-freeze-body')
  }
}
