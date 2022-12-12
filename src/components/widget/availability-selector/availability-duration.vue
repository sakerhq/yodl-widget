<script>
import orderBy from 'lodash/orderBy'

export default {
  name: 'AvailabilityDuration',
  props: {
    options: { type: Array, default: () => [] },
    selected: { type: Object, default: null }
  },
  computed: {
    sortedOptions() {
      return orderBy(this.options, 'duration', 'asc')
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
  <div class="grid grid-cols-4 gap-y-3 lg:gap-3">
    <div
      v-for="option in sortedOptions"
      :key="option.id"
      class="col-span-4 lg:col-span-1 py-2 px-4 lg:text-center text-base lg:text-sm font-medium whitespace-nowrap rounded-lg overflow-hidden overflow-ellipsis"
      :class="[selected && option.id === selected.id ? 'bg-black text-white pointer-events-none' : 'hover:bg-[#F2F2F2] cursor-pointer']"
      @click="select(option)"
    >
      {{ option.duration / 60 }}
      min
    </div>
  </div>
</template>
