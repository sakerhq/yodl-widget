<script>
import CloseButton from '@/components/shared/close-button.vue'
import { DateTime } from 'luxon'
import BackButton from '@/components/shared/back-button.vue'
import { formatSecondsToMinutes } from '@/utils/time'
import { formatPenniesToDollars } from '@/utils/money'
import BookingDatetime from '@/components/widget/booking-datetime.vue'
import BookingDuration from '@/components/widget/booking-duration.vue'
import BookingGuest from '@/components/widget/booking-guest.vue'
import BookingProduct from '@/components/widget/booking-product.vue'
import { mapState } from 'pinia'
import { useWidgetStore } from '@/store/widget.js'
import WizardNavigation from '@/components/widget/wizard-navigation.vue'

export default {
  name: 'SessionDetailStep',
  components: {
    BookingDatetime,
    BookingDuration,
    BookingGuest,
    BookingProduct,
    BackButton,
    CloseButton,
    WizardNavigation
  },
  data() {
    return {
      name: null,
      email: null
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      duration: 'duration',
      user: 'user',
      timeZone: 'timeZone'
    }),
    amountFormatted() {
      return formatPenniesToDollars(this.duration.amount)
    },
    durationFormatted() {
      return formatSecondsToMinutes(this.duration.duration, 'minutes')
    },
    dateString() {
      return DateTime.fromISO(`${this.form.date.year}-${this.form.date.month}-${this.form.date.day}`)
        .setLocale('en')
        .toLocaleString({ month: 'long', day: '2-digit' })
    },
    friendlyTimeZone() {
      return DateTime.local().setZone(this.timeZone).toFormat('ZZZZZ')
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
  <div class="relative flex flex-col h-full w-full">
    <WizardNavigation class="p-4 pt-5" @on-exit="$emit('on-exit')" @on-previous="$emit('on-previous')" />

    <div class="flex-1 px-4 overflow-y-auto">
      <!-- selection -->
      <div class="mt-8 border border-black border-opacity-10 rounded-md">
        <div class="grid grid-cols-5">
          <BookingDuration class="col-span-2 border-r border-b border-black border-opacity-10" />
          <BookingDatetime class="col-span-3 border-b border-black border-opacity-10" />
        </div>
        <BookingProduct :products="user.products" class="border-b border-black border-opacity-10" />
        <BookingGuest />
      </div>
      <!-- time zone -->
      <div class="mt-4 text-center leading-[20px] text-sm font-light">
        Your time zone is
        <span>{{ friendlyTimeZone }}</span>
      </div>
      <!-- detail -->
      <div class="h-px my-4 border-t border-black border-opacity-10"></div>
      <div class="py-3 px-4 bg-black bg-opacity-5 rounded-lg">
        <div class="flex items-center justify-between text-sm">
          <p>{{ durationFormatted }}</p>
          <p>{{ amountFormatted }}</p>
        </div>
      </div>
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
