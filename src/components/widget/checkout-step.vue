<script>
import { loadStripe } from '@stripe/stripe-js'
import WizardNavigation from '@/components/widget/wizard-navigation.vue'

let elements = null
let card = null
import BackButton from '@/components/shared/back-button.vue'
import CloseButton from '@/components/shared/close-button.vue'

export default {
  name: 'CheckoutStep',
  props: {
    state: { type: Object, required: true }
  },
  components: {
    BackButton,
    CloseButton,
    WizardNavigation
  },
  methods: {
    Unmount() {
      this.$emit('on-unmount')
    }
  },
  async mounted() {
    // elements = stripe.elements({ appearance: { theme: 'stripe' }, clientSecret: this.paymentIntent.clientSecret })
    // element = elements.create('payment')
    // element.update({ business: { name: 'Yodl' } })
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    elements = stripe.elements()
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

    card = elements.create('card', { style: style })
    card.mount('#card-element')
  }
}
</script>

<template>
  <div class="relative flex flex-col h-full w-full">
    <WizardNavigation class="p-4 pt-5" @on-exit="$emit('on-exit')" @on-previous="$emit('on-previous')" />
    <div class="flex-1 p-6">
      <div id="card-element"></div>
    </div>
    <div class="flex-shrink-0">
      <div class="px-4 mb-5">
        <button
          type="button"
          class="w-full bg-[#FF385C] text-white rounded-lg px-4 py-3 text-sm leading-6 font-semibold text-center disabled:pointer-events-none disabled:opacity-50"
          @click="$emit('on-next')"
        >
          Set date and time
        </button>
      </div>
    </div>
  </div>
</template>
