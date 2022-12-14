<script>
import BackButton from '@/components/shared/back-button.vue'
import CloseButton from '@/components/shared/close-button.vue'
import WizardNavigation from '@/components/widget/wizard-navigation.vue'
import { mapState } from 'pinia'
import { useWidgetStore } from '@/store/widget.js'
import { CHECKOUT_TYPE } from '@/utils/constants'
import WidgetAPI from '@/api/widget.js'
import { loadStripe } from '@stripe/stripe-js'

let elements = null
let card = null

export default {
  name: 'CheckoutStep',
  components: {
    BackButton,
    CloseButton,
    WizardNavigation
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
    })
  },
  methods: {
    submit() {
      this.stripe
        .confirmCardPayment(this.interaction.clientSecret, {
          payment_method: {
            card: card
          }
        })
        .then(async () => {
          // TODO: Handle success
        })
        .catch((err) => {
          // TODO: Handle error
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  async mounted() {
    // NOTE: Request payment intent
    const { data: interaction } = await WidgetAPI.requestPaymentIntent({
      priceId: parseInt(this.duration.id),
      scheduledOn: this.date,
      scheduledTime: this.time,
      name: this.name,
      email: this.email,
      type: CHECKOUT_TYPE.interaction
    })
    this.interaction = interaction
    console.log(interaction)

    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    elements = this.stripe.elements()

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
          @click="submit"
        >
          Set date and time
        </button>
      </div>
    </div>
  </div>
</template>
