<script>
import AvailabilitySelector from '@/components/widget/availability-selector/index.vue'
import ArrowDownIcon from '@/components/shared/arrow-down-icon.vue'
import { mapState } from 'pinia'
import { useWidgetStore } from '@/store/widget.js'
import { DateTime } from 'luxon'

export default {
  name: 'BookingDatetime',
  components: {
    ArrowDownIcon,
    AvailabilitySelector
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      availabilities: 'availabilities',
      date: 'date',
      time: 'time',
      timeZone: 'timeZone'
    }),
    datetime() {
      return {
        date: this.date,
        time: this.time
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
    open() {
      this.show = true
    },
    close() {
      this.show = false
    },
    select(datetime) {
      this.store.$patch({ date: datetime.date, time: datetime.time })
      this.close()
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div>
    <div class="relative cursor-pointer pl-3 pr-10 py-2" @click="open">
      <div class="text-[10px] leading-4 font-bold uppercase tracking-wider mb-0.5">When</div>
      <div v-if="datetime.date && datetime.time" class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
        {{ formatDate(datetime.date) }}, {{ datetime.time }}
      </div>
      <div v-else class="text-sm text-gray-400">Select</div>
      <ArrowDownIcon class="absolute top-1/2 -mt-2 right-4 w-4 h-4 text-black" />
    </div>

    <button
      v-if="show"
      type="button"
      class="fixed inset-0 h-full w-full bg-transparent focus:outline-none cursor-default z-10"
      tabindex="-1"
      @click.stop="close"
    ></button>

    <div v-if="show" class="absolute inset-0 bg-white z-50 overflow-y-auto">
      <AvailabilitySelector
        :availabilities="availabilities"
        :datetime="datetime"
        :modal="true"
        :time-zone="timeZone"
        @on-confirm="select"
      />
    </div>
  </div>
</template>
