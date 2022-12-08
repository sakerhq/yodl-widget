<script>
import useVuelidate from '@vuelidate/core'
import { required, email, maxLength, minLength } from '@vuelidate/validators'
import { DateTime } from 'luxon'
import BackButton from '@/components/shared/back-button.vue'
import { formatSecondsToMinutes } from '@/utils/time'
import { formatPenniesToDollars } from '@/utils/money'

export default {
  name: '',
  props: {
    state: { type: Object, required: true }
  },
  components: {
    BackButton
  },
  data() {
    return {
      name: null,
      email: null
    }
  },
  computed: {
    amountFormatted() {
      return formatPenniesToDollars(this.form.price.amount)
    },
    durationFormatted() {
      return formatSecondsToMinutes(this.form.price.duration)
    },
    dateString() {
      return DateTime
        .fromISO(`${this.form.date.year}-${this.form.date.month}-${this.form.date.day}`)
        .setLocale('en')
        .toLocaleString({ month: 'long', day: '2-digit' })
    }
  },
  methods: {
    previous() {
      this.$emit('on-previous')
    }
  }
}
</script>

<template>
  <div class="p-4">
    <BackButton @on-click="previous" />
  </div>
</template>