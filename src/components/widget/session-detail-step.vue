<script>
import BackButton from '@/components/shared/back-button.vue'
import CloseButton from '@/components/shared/close-button.vue'
import BookingDatetime from '@/components/widget/booking-datetime.vue'
import BookingDuration from '@/components/widget/booking-duration.vue'
import BookingGuest from '@/components/widget/booking-guest.vue'
import BookingProduct from '@/components/widget/booking-product.vue'
import WizardNavigation from '@/components/widget/wizard-navigation.vue'
import { mapState } from 'pinia'
import { useWidgetStore } from '@/store/widget.js'
import { DateTime } from 'luxon'
import { formatSecondsToMinutes } from '@/utils/time'
import { formatPenniesToDollars } from '@/utils/money'

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
    dateString() {
      return DateTime.fromISO(`${this.form.date.year}-${this.form.date.month}-${this.form.date.day}`)
        .setLocale('en')
        .toLocaleString({ month: 'long', day: '2-digit' })
    },
    durationFormatted() {
      return formatSecondsToMinutes(this.duration.duration, 'minutes')
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
  <div class="yw-relative yw-flex yw-flex-col yw-h-full yw-w-full">
    <WizardNavigation class="yw-p-4 yw-pt-5" @on-exit="$emit('on-exit')" @on-previous="$emit('on-previous')" />
    <div class="yw-flex-1 yw-px-4 yw-overflow-y-auto">
      <!-- selection -->
      <div class="yw-mt-8 yw-border yw-border-black yw-border-opacity-10 yw-rounded-md">
        <div class="yw-grid yw-grid-cols-5">
          <BookingDuration class="yw-col-span-2 yw-border-r yw-border-b yw-border-black yw-border-opacity-10" />
          <BookingDatetime class="yw-col-span-3 yw-border-b yw-border-black yw-border-opacity-10" />
        </div>
        <BookingProduct :products="user.products" class="yw-border-b yw-border-black yw-border-opacity-10" />
        <BookingGuest />
      </div>
      <!-- time zone -->
      <div class="yw-mt-4 yw-text-center yw-leading-[20px] yw-text-sm yw-font-light">
        Your time zone is
        <span>{{ friendlyTimeZone }}</span>
      </div>
      <!-- detail -->
      <div class="yw-h-px yw-my-4 yw-border-t yw-border-black yw-border-opacity-10"></div>
      <div class="yw-py-3 yw-px-4 yw-bg-black yw-bg-opacity-5 yw-rounded-lg">
        <div class="yw-flex yw-items-center yw-justify-between yw-text-sm">
          <p>{{ durationFormatted }}</p>
          <p>{{ amountFormatted }}</p>
        </div>
      </div>
    </div>

    <div class="flex-shrink-0">
      <div class="yw-px-4 yw-mb-5">
        <button
          type="button"
          class="yw-w-full yw-bg-[#FF385C] yw-text-white yw-rounded-lg yw-px-4 yw-py-3 yw-text-sm yw-leading-6 yw-font-semibold yw-text-center disabled:yw-pointer-events-none disabled:yw-opacity-50"
          @click="$emit('on-next')"
        >
          Set date and time
        </button>
      </div>
    </div>
  </div>
</template>
