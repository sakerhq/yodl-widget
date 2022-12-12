<script>
import { DateTime } from 'luxon'
import AvailabilitySelector from '@/components/widget/availability-selector/index.vue'
import { mapState } from 'pinia'
import { useWidgetStore } from '@/store/widget.js'

export default {
  name: 'BookingDatetime',
  components: {
    AvailabilitySelector
  },
  data() {
    return {
      showSelector: false
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      availabilities: 'availabilities',
      selectedDate: 'date',
      selectedTime: 'time'
    }),
    datetime() {
      return {
        date: this.selectedDate,
        time: this.selectedTime
      }
    }
  },
  methods: {
    formatDate(date) {
      let format = 'M/d/yy'

      // if (this.$auth.user && this.$auth.user.dateFormat === 'european_standard') {
      //   format = 'd/M/yy'
      // }

      return DateTime.fromISO(date).toFormat(format)
    },
    openSelector() {
      this.showSelector = true
    },
    closeSelector() {
      this.showSelector = false
    },
    selectDatetime(datetime) {
      this.store.$patch({ date: datetime.date })
      this.store.$patch({ time: datetime.time })

      this.closeSelector()
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div class="relative">
    <div class="relative cursor-pointer pl-3 pr-10 py-2" @click="openSelector">
      <div class="text-[10px] leading-4 font-bold uppercase tracking-wider mb-0.5">When</div>
      <div v-if="datetime.date && datetime.time" class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
        {{ formatDate(datetime.date) }}, {{ datetime.time }}
      </div>
      <div v-else class="text-sm text-gray-400">Select</div>
      <ArrowDownIcon class="absolute top-1/2 -mt-2 right-4 w-4 h-4 text-black" />
    </div>

    <BaseCloseOverlay v-if="showSelector" class="z-40" @close-click="closeSelector" />
    <div
      v-if="showSelector"
      class="a-shadow fixed lg:absolute top-0 lg:top-full bottom-0 lg:bottom-auto left-0 lg:left-auto right-0 lg:-right-14 w-full max-w-full lg:max-w-none lg:w-[750px] bg-white rounded-lg z-50"
    >
      <AvailabilitySelector
        :availabilities="availabilities"
        :datetime="datetime"
        :modal="true"
        :time-zone="currentTimeZone"
        @on-confirm="selectDatetime"
      />
    </div>
  </div>
</template>
