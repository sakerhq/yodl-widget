<script>
import ArrowDownIcon from '@/components/shared/arrow-down-icon.vue'
import { useWidgetStore } from '@/store/widget.js'
import { mapState } from 'pinia'
import { formatSecondsToMinutes } from '@/utils/time'
import orderBy from 'lodash/orderBy'

export default {
  name: 'BookingDuration',
  components: {
    ArrowDownIcon
  },
  data() {
    return {
      showDropdown: false
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      product: 'product',
      duration: 'duration'
    }),
    options() {
      return orderBy(this.product.prices, 'duration', 'asc')
    }
  },
  methods: {
    open() {
      this.showDropdown = true
    },
    close() {
      this.showDropdown = false
    },
    select(duration) {
      this.store.$patch({ duration: duration })
      this.close()
    },
    formatDurationFromSecondsToMinutes(duration, suffix) {
      return formatSecondsToMinutes(duration, suffix)
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div class="relative">
    <div class="cursor-pointer relative pl-3 pr-10 py-2" @click="open">
      <div class="text-[10px] leading-4 font-bold uppercase tracking-wider mb-0.5">Duration</div>
      <div class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
        {{ formatDurationFromSecondsToMinutes(duration.duration) }}
      </div>

      <ArrowDownIcon class="absolute top-1/2 -mt-2 right-4 w-4 h-4 text-black" />
    </div>

    <button
      v-if="showDropdown"
      type="button"
      class="fixed inset-0 h-full w-full bg-transparent focus:outline-none cursor-default z-10"
      tabindex="-1"
      @click.stop="close"
    ></button>

    <div
      v-if="showDropdown"
      class="a-shadow absolute top-0 left-0 lg:left-auto lg:top-full w-full max-w-full lg:max-w-none p-3 bg-white rounded-lg z-20"
    >
      <div
        v-for="duration in options"
        :key="duration.id"
        class="px-3.5 py-1.5 mb-2 last:mb-0 rounded-lg text-sm font-medium leading-6"
        :class="[
          duration && duration.id === duration.id
            ? 'bg-black text-white pointer-events-none'
            : 'hover:bg-[#F2F2F2] cursor-pointer'
        ]"
        @click="select(duration)"
      >
        {{ formatDurationFromSecondsToMinutes(duration.duration, 'minutes') }}
      </div>
    </div>
  </div>
</template>
