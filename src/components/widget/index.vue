<script>
import { DateTime } from 'luxon'
import UserAPI from '@/api/user.js'
import WidgetAPI from '@/api/widget.js'
import { AVAILABILITY_DAY_LIMIT, LAYOUT_TYPE } from '@/utils/constants'
import ProductSelectionStep from '@/components/widget/product-selection-step.vue'
import SessionDetailStep from '@/components/widget/session-detail-step.vue'
import CheckoutStep from '@/components/widget/checkout-step.vue'
import { useWidgetStore } from '@/store/widget'
import { mapState } from 'pinia'

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
    // Events
    onFormUpdate(payload) {
      Object.assign(this.form, payload.data)

      console.table('@on-form-update', this.form)
    },
    onNext(data) {
      if (this.currentStep < this.steps.length - 1) this.currentStep++
    },
    onPrevious(data) {
      if (this.currentStep > 0) this.currentStep--
    },
    onUnmount() {
      window.YodlWidget.unmount()
    },
    // End events
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
  watch: {
    duration: {
      handler: function () {
        // const startDate = DateTime.local().toISODate()
        // // TODO: Make sure end date time is in time zone
        // const endDate = DateTime.local().plus({ days: AVAILABILITY_DAY_LIMIT }).toISODate()
        // this.store.availabilities({
        //   priceId: this.duration.id,
        //   startDate,
        //   endDate,
        //   timeZone: this.timeZone
        // })
      }
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
  <!-- layout - default -->
  <div v-if="layout === DEFAULT_LAYOUT" class="fixed inset-0 bg-black/25" @click.stop.prevent="onUnmount">
    <!-- loading -->
    <div v-if="loading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">loading...</div>
    <!-- wizard -->
    <div
      v-else
      @click.stop.prevent=""
      class="yodl-widget absolute bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 h-3/4 md:h-full md:max-h-[640px] w-full md:max-w-[420px] md:border border-black/10 rounded-tl-lg rounded-tr-lg md:rounded-lg bg-white shadow-lg"
    >
      <component
        :is="steps[currentStep]"
        @on-form-update="onFormUpdate"
        @on-next="onNext"
        @on-previous="onPrevious"
        @on-unmount="onUnmount"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

.yodl-widget {
  font-family: 'Manrope';
}
</style>
