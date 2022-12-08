import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/index.css'
import { LAYOUT_TYPE } from '@/utils/constants'

window.YodlWidget = {
    app: null,
    options: {
        id: 'yodl-widget',
        layout: LAYOUT_TYPE.default,
        username: null
    },
    init: function(options) {
        Object.assign(this.options, options)
        
        // NOTE: Render root element
        const root = document.createElement('div')
        root.id = this.options.id
        document.body.appendChild(root)

        this.mount()
    },
    mount: function() {
        const root = document.getElementById(this.options.id)

        if (root) {
            this.app = createApp(App)
            this.app.mount(root)
            document.body.classList.add('yodl-widget-freeze-body')
        } else {
            throw new Error(`[ERROR] - Unable to detect root element with id "${this.options.id}"`)
        }
    },
    unmount: function() {
        this.app.unmount()
        document.body.classList.remove('yodl-widget-freeze-body')
    }
}

