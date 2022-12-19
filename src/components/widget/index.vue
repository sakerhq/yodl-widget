<script>
// NOTE: Load Stripe.js immediately per https://github.com/stripe/stripe-js docs
import '@stripe/stripe-js'
import CheckoutStep from '@/components/widget/checkout-step.vue'
import ConfirmationStep from '@/components/widget/confirmation-step.vue'
import ProductSelectionStep from '@/components/widget/product-selection-step.vue'
import SessionDetailStep from '@/components/widget/session-detail-step.vue'

import UserAPI from '@/api/user.js'
import WidgetAPI from '@/api/widget.js'
import { useWidgetStore } from '@/store/widget'
import { mapState } from 'pinia'
import { DateTime } from 'luxon'
import { LAYOUT_TYPE } from '@/utils/constants'

export default {
  name: 'YodlWidget',
  components: {
    CheckoutStep,
    ConfirmationStep,
    ProductSelectionStep,
    SessionDetailStep
  },
  data() {
    return {
      currentStep: 0,
      form: {
        product: null,
        price: null,
        date: null,
        time: null,
        timeZone: null
      },
      loading: false,
      steps: ['product-selection-step', 'session-detail-step', 'checkout-step', 'confirmation-step']
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      duration: 'duration',
      timeZone: 'timeZone',
      user: 'user'
    })
  },
  methods: {
    onNext() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++
    },
    onPrevious() {
      if (this.currentStep > 0) this.currentStep--
    },
    onUnmount() {
      window.YodlWidget.unmount()
    },
    async submit(data) {
      this.loading = true

      try {
        const payload = {
          priceId: this.form.price.id,
          scheduledTime: this.form.time,
          scheduledOn: this.form.date,
          timeZone: this.form.timeZone,
          email: data.email,
          name: data.name
        }

        await WidgetAPI.bookInteraction(payload)

        this.next()
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    }
  },
  mounted() {
    const {
      options: { layout }
    } = window.YodlWidget

    // NOTE: Only freeze body for specific layouts
    switch (layout) {
      case LAYOUT_TYPE.default:
        document.body.classList.add('yodl-widget-freeze-body')
    }
  },
  async created() {
    this.DEFAULT_LAYOUT = LAYOUT_TYPE.default

    const {
      options: { username, layout }
    } = window.YodlWidget

    this.layout = layout

    this.loading = true
    const { data } = await UserAPI.user({ username }).catch((err) => {
      // TODO: Send error to Sentry
    })

    this.store = useWidgetStore()

    this.store.$patch({
      timeZone: DateTime.local().zoneName || 'Etc/GMT',
      user: data
    })

    this.loading = false
  }
}
</script>

<template>
  <div v-if="layout === DEFAULT_LAYOUT" class="yw-fixed yw-inset-0 yw-bg-black/25" @click.stop.prevent="onUnmount">
    <div
      v-if="loading"
      class="yw-absolute yw-top-1/2 yw-left-1/2 -yw-translate-x-1/2 -yw-translate-y-1/2 yw-text-white"
    >
      loading...
    </div>
    <div
      v-else
      @click.stop.prevent=""
      class="yodl-widget yw-absolute yw-bottom-0 yw-left-0 yw-right-0 md:yw-top-1/2 md:yw-left-1/2 md:-yw-translate-x-1/2 md:-yw-translate-y-1/2 yw-h-3/4 md:yw-h-full md:yw-max-h-[640px] yw-w-full md:yw-max-w-[420px] md:yw-border yw-border-black/10 yw-rounded-tl-lg yw-rounded-tr-lg md:yw-rounded-lg yw-bg-white yw-shadow-lg"
    >
      <component :is="steps[currentStep]" @on-next="onNext" @on-previous="onPrevious" @on-exit="onUnmount" />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.yodl-widget {
  font-family: 'Manrope';
}
:deep().a-shadow {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
</style>
