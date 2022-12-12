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

export default {
  name: 'SessionDetailStep',
  components: {
    BookingDatetime,
    BookingDuration,
    BookingGuest,
    BookingProduct,
    BackButton,
    CloseButton
  },
  data() {
    return {
      name: null,
      email: null
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      user: 'user'
    }),
    amountFormatted() {
      return formatPenniesToDollars(this.form.price.amount)
    },
    durationFormatted() {
      return formatSecondsToMinutes(this.form.price.duration)
    },
    dateString() {
      return DateTime.fromISO(`${this.form.date.year}-${this.form.date.month}-${this.form.date.day}`)
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
  <div class="flex flex-col h-full w-full">
    <div class="flex-shrink-0 flex items-center justify-between p-4">
      <BackButton @on-click="previous" />
      <CloseButton @on-close="unmount" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="relative mt-8 border border-black border-opacity-10 rounded-md">
        <div class="grid grid-cols-5">
          <BookingDuration class="col-span-2 border-r border-b border-black border-opacity-10" />
          <BookingDatetime class="col-span-3 border-b border-black border-opacity-10" />
        </div>
        <BookingProduct :products="user.products" class="border-b border-black border-opacity-10" />
        <BookingGuest />
      </div>
    </div>

    <div class="flex-shrink-0">
      <div class="h-px bg-[#ebebeb] mb-3"></div>
      <div class="px-6 mb-6">
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
