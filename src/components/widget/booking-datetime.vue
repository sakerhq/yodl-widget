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
    <div class="yw-relative yw-cursor-pointer yw-pl-3 yw-pr-10 yw-py-2" @click="open">
      <div class="yw-text-[10px] yw-leading-4 yw-font-bold yw-uppercase yw-tracking-wider yw-mb-0.5">When</div>
      <div
        v-if="datetime.date && datetime.time"
        class="yw-text-sm yw-overflow-hidden yw-whitespace-nowrap yw-overflow-ellipsis"
      >
        {{ formatDate(datetime.date) }}, {{ datetime.time }}
      </div>
      <div v-else class="yw-text-sm yw-text-gray-400">Select</div>
      <ArrowDownIcon class="yw-absolute yw-top-1/2 -yw-mt-2 yw-right-4 yw-w-4 yw-h-4 yw-text-black" />
    </div>

    <button
      v-if="show"
      type="button"
      class="yw-fixed yw-inset-0 yw-h-full yw-w-full yw-bg-transparent focus:yw-outline-none yw-cursor-default yw-z-10"
      tabindex="-1"
      @click.stop="close"
    ></button>

    <div v-if="show" class="yw-absolute yw-inset-0 yw-bg-white yw-z-50 yw-overflow-y-auto">
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
