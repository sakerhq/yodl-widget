<script>
import orderBy from 'lodash/orderBy'
import { useWidgetStore } from '@/store/widget.js'
import { mapState } from 'pinia'

export default {
  name: 'BookingDuration',
  data() {
    return {
      showSelector: false
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      selectedProduct: 'product',
      selectedProductDuration: 'duration'
    }),
    sortedDurationOptions() {
      return orderBy(this.selectedProduct.prices, 'duration', 'asc')
    }
  },
  methods: {
    openSelector() {
      this.showSelector = true
    },
    closeSelector() {
      this.showSelector = false
    },
    selectDuration(duration) {
      this.store.$patch({ duration: duration })

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
    <div class="cursor-pointer relative pl-3 pr-10 py-2" @click="openSelector">
      <div class="text-[10px] leading-4 font-bold uppercase tracking-wider mb-0.5">Duration</div>
      <div class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
        {{ selectedProductDuration.duration / 60 }} min
      </div>

      <ArrowDownIcon class="absolute top-1/2 -mt-2 right-4 w-4 h-4 text-black" />
    </div>

    <BaseCloseOverlay v-if="showSelector" class="z-40" @close-click="closeSelector" />
    <div
      v-if="showSelector"
      class="a-shadow absolute top-0 left-0 lg:left-auto lg:top-full w-full max-w-full lg:max-w-none p-3 bg-white rounded-lg z-50"
    >
      <div
        v-for="duration in sortedDurationOptions"
        :key="duration.id"
        class="px-4 py-2 mb-3 last:mb-0 rounded-lg text-sm font-medium leading-6"
        :class="[
          selectedProductDuration && duration.id === selectedProductDuration.id
            ? 'bg-black text-white pointer-events-none'
            : 'hover:bg-[#F2F2F2] cursor-pointer'
        ]"
        @click="selectDuration(duration)"
      >
        {{ duration.duration / 60 }} min
      </div>
    </div>
  </div>
</template>
