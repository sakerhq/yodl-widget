<script>
// NOTE: Load Stripe.js immediately per https://github.com/stripe/stripe-js docs
import '@stripe/stripe-js'
import CheckoutStep from '@/components/widget/checkout-step.vue'
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
      steps: ['product-selection-step', 'session-detail-step', 'checkout-step']
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

    // Only freeze body for specific layouts
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
  <div v-if="layout === DEFAULT_LAYOUT" class="fixed inset-0 bg-black/25" @click.stop.prevent="onUnmount">
    <div v-if="loading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">loading...</div>
    <div
      v-else
      @click.stop.prevent=""
      class="yodl-widget absolute bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 h-3/4 md:h-full md:max-h-[640px] w-full md:max-w-[420px] md:border border-black/10 rounded-tl-lg rounded-tr-lg md:rounded-lg bg-white shadow-lg overflow-hidden"
    >
      <component
        :is="steps[currentStep]"
        @on-form-update="onFormUpdate"
        @on-next="onNext"
        @on-previous="onPrevious"
        @on-exit="onUnmount"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.yodl-widget {
  font-family: 'Manrope';
}
/deep/ .a-shadow {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
</style>
