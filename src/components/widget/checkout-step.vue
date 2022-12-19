<script>
import BackButton from '@/components/shared/back-button.vue'
import CloseButton from '@/components/shared/close-button.vue'
import WizardNavigation from '@/components/widget/wizard-navigation.vue'
import StripeIcon from '@/components/shared/stripe-icon.vue'
import { mapState } from 'pinia'
import { useWidgetStore } from '@/store/widget.js'
import { CHECKOUT_TYPE } from '@/utils/constants'
import WidgetAPI from '@/api/widget.js'
import { loadStripe } from '@stripe/stripe-js'
import { DateTime } from 'luxon'

export default {
  name: 'CheckoutStep',
  components: {
    BackButton,
    CloseButton,
    StripeIcon,
    WizardNavigation
  },
  data() {
    return {
      card: null,
      elements: null,
      loading: true,
      paymentIntent: null
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      date: 'date',
      duration: 'duration',
      email: 'email',
      name: 'name',
      product: 'product',
      time: 'time',
      user: 'user',
      timeZone: 'timeZone'
    }),
    dateFormatted() {
      return DateTime.fromISO(this.metadata.scheduledOn).toFormat('ccc. DDD')
    },
    endTimeFormatted() {
      // NOTE: 24h time format
      if (this.timeFormat === 'T') return `${this.metadata.endTime}`
      else return `${this.metadata.endTime} ${this.metadata.endMeridian}`
    },
    friendlyTimeZone() {
      return DateTime.local().setZone(this.timeZone).toFormat('ZZZZZ')
    },
    metadata() {
      return this.paymentIntent.metadata
    },
    startTimeFormatted() {
      // NOTE: 24h time format
      if (this.timeFormat === 'T') return `${this.metadata.startTime}`
      else return `${this.metadata.startTime} ${this.metadata.startMeridian}`
    },
    purchase() {
      switch (this.paymentIntent.metadata.type) {
        case CHECKOUT_TYPE.interaction:
          return {
            email: this.metadata.consumerEmail,
            duration: this.metadata.duration,
            name: this.metadata.consumerName
          }
        default:
          break
      }
    }
  },
  methods: {
    async setupPaymentProcessor() {
      this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

      this.elements = this.stripe.elements()

      const style = {
        base: {
          color: '#32325d',
          fontFamily: 'Arial, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#32325d'
          }
        },
        invalid: {
          fontFamily: 'Arial, sans-serif',
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }

      this.card = this.elements.create('card', { style: style })
      this.card.mount('#card-element')
    },
    submit() {
      this.loading = true
      this.stripe
        .confirmCardPayment(this.paymentIntent.clientSecret, {
          payment_method: {
            card: this.card
          }
        })
        .then(() => {
          // TODO: payment verification
          console.log('success')
          this.$emit('on-next')
        })
        .catch((err) => {
          // TODO: Handle error
        })
        .finally(() => {})
    }
  },
  async mounted() {
    this.loading = true

    // NOTE: Request payment intent
    const { data: paymentIntent } = await WidgetAPI.requestPaymentIntent({
      priceId: this.duration.id,
      scheduledOn: this.date,
      scheduledTime: this.time,
      name: this.name,
      email: this.email,
      type: CHECKOUT_TYPE.interaction
    })

    this.paymentIntent = paymentIntent

    console.log('paymentIntent', paymentIntent)

    // NOTE: Initialize payment processor
    await this.setupPaymentProcessor()

    this.loading = false
  }
}
</script>

<template>
  <div class="relative flex flex-col h-full w-full">
    <WizardNavigation class="flex-shrink-0 p-4 pt-5" @on-exit="$emit('on-exit')" @on-previous="$emit('on-previous')" />
    <div v-if="!loading" class="flex-1 pt-6 px-6 space-y-4">
      <!-- detail  -->
      <div>
        <p class="mb-1 font-semibold">Details</p>
        <p class="mb-0.5 leading-[24px] text-sm truncate">{{ metadata.productName }}</p>
        <nuxt-link :to="`/${user.username}`" class="leading-[20px] text-sm opacity-60">
          with
          <span class="underline">{{ user.name }}</span>
        </nuxt-link>
      </div>
      <!-- date & time -->
      <div>
        <p class="mb-1 font-semibold">Date & Time</p>
        <p class="mb-0.5 leading-[24px] text-sm">
          <span>{{ dateFormatted }}</span>
          <span>•</span>
          <span>{{ `${startTimeFormatted} - ${endTimeFormatted}` }}</span>
        </p>
        <p class="leading-[24px] text-sm opacity-60">{{ friendlyTimeZone }}</p>
      </div>
      <!-- info -->
      <div>
        <p class="mb-1 font-semibold">Your info</p>
        <p class="mb-0.5 leading-[24px] text-sm">{{ purchase.name }}</p>
        <p class="leading-[24px] text-sm opacity-60">{{ purchase.email }}</p>
      </div>
    </div>
    <div class="flex-1 mt-4 p-6 pt-4 border-t border-black/10">
      <p class="flex items-center justify-between mb-8 font-semibold">
        Pay with
        <a href="https://stripe.com/" target="blank" class="inline-block">
          <StripeIcon class="w-24 text-[#BDBFCD]" />
        </a>
      </p>
      <div id="card-element" class="mb-6"></div>
    </div>
    <div class="flex-shrink-0">
      <div class="px-4 mb-5">
        <button
          type="button"
          :class="[
            loading ? 'bg-gray-400' : '',
            'w-full bg-[#FF385C] text-white rounded-lg px-4 py-3 text-sm leading-6 font-semibold text-center disabled:pointer-events-none disabled:opacity-50'
          ]"
          @click="submit"
        >
          Confirm and pay
        </button>
      </div>
    </div>
  </div>
</template>
