<script>
import sortBy from 'lodash/sortBy'
import { formatPenniesToDollars } from '@/utils/money'

export default {
  props: {
    product: { type: Object, required: true },
    selected: { type: Boolean, required: true, default: false }
  },
  computed: {
    lowestPrice() {
      return formatPenniesToDollars(sortBy(this.product.prices, ['amount'])[0].amount)
    },
  }
}
</script>

<template>
  <div class="relative px-4 py-3 rounded-xl cursor-pointer">
      <div
        :class="[
          selected ? 'border-2 border-black' : 'border border-black border-opacity-10',
          'absolute -inset-0 rounded-lg'
        ]"
      >
      </div>
      <div class="text-sm font-semibold mb-1">{{ product.name }}</div>
      <div class="text-xs">From: <span class="text-[#FF385C]">$60.00</span> / 15 minutes</div>
      <div class="h-px bg-[#ccc] my-2"></div>
      <div class="mb-1 text-xs font-light">{{ product.description }}</div>
  </div>
</template>
