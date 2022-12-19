<script>
export default {
  name: 'AvailabilityDuration',
  props: {
    options: { type: Array, default: () => [] },
    selected: { type: Object, default: null }
  },
  computed: {
    sortedOptions() {
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

      return sortBy(this.options, 'duration')
    }
  },
  methods: {
    select(option) {
      this.$emit('on-select', option)
    }
  }
}
</script>

<template>
  <div class="yw-grid yw-grid-cols-4 yw-gap-y-3 lg:yw-gap-3">
    <div
      v-for="option in sortedOptions"
      :key="option.id"
      class="yw-col-span-4 lg:yw-col-span-1 yw-py-2 yw-px-4 lg:yw-text-center yw-text-base lg:yw-text-sm yw-font-medium yw-whitespace-nowrap yw-rounded-lg yw-overflow-hidden yw-overflow-ellipsis"
      :class="[
        selected && option.id === selected.id
          ? 'yw-bg-black yw-text-white yw-pointer-events-none'
          : 'hover:yw-bg-[#F2F2F2] yw-cursor-pointer'
      ]"
      @click="select(option)"
    >
      {{ option.duration / 60 }}
      min
    </div>
  </div>
</template>
