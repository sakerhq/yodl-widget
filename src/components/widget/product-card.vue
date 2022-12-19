<script>
import { formatPenniesToDollars } from '@/utils/money'
import { formatSecondsToMinutes } from '@/utils/time'

export default {
  props: {
    product: { type: Object, required: true },
    selected: { type: Boolean, required: true, default: false }
  },
  computed: {
    lowestPrice() {
      const sortBy = (collection, prop) => {
        // NOTE: Bubble sort
        let last = collection.length - 1
        let sorted = false

        while (!sorted) {
          sorted = true
          for (let i = 0; i < last; i++) {
            if (collection[i][prop] > collection[i + 1][prop]) {
              const temp = collection[i]
              collection[i] = collection[i + 1]
              collection[i + 1] = temp

              sorted = false
            }
          }
          last -= 1
        }

        return collection
      }

      return sortBy(this.product.prices, 'amount')[0]
    }
  },
  created() {
    this.formatPenniesToDollars = formatPenniesToDollars
    this.formatSecondsToMinutes = formatSecondsToMinutes
  }
}
</script>

<template>
  <div class="yw-relative yw-px-4 yw-py-3 yw-rounded-xl yw-cursor-pointer">
    <div
      :class="[
        selected ? 'yw-border-2 yw-border-black' : 'yw-border yw-border-black yw-border-opacity-10',
        'yw-absolute -yw-inset-0 yw-rounded-lg'
      ]"
    ></div>
    <div class="yw-text-sm yw-font-semibold yw-mb-1">{{ product.name }}</div>
    <div class="yw-text-xs">
      From:
      <span class="yw-text-[#FF385C]">{{ formatPenniesToDollars(lowestPrice.amount) }}</span>
      /
      <span>{{ formatSecondsToMinutes(lowestPrice.duration, 'minutes') }}</span>
    </div>
    <div class="yw-h-px yw-my-2 yw-bg-black yw-bg-opacity-10"></div>
    <div class="yw-mb-1 yw-text-xs yw-font-light">{{ product.description }}</div>
  </div>
</template>
