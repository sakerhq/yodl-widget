<script>
export default {
  name: 'AvailabilityTime',
  props: {
    timeSlots: { type: Array, default: () => [] },
    selectedTime: { type: String, default: null }
  },
  computed: {
    availableTimeSlots() {
      return this.timeSlots.filter((timeSlot) => timeSlot.status === 'available')
    }
  },
  methods: {
    select(time) {
      this.$emit('on-select', time)
    }
  }
}
</script>

<template>
  <div class="yw-space-y-1.5 yw-overflow-y-auto">
    <div
      v-for="time in availableTimeSlots"
      :key="time.startTime"
      class="yw-px-3 yw-py-1.5 yw-leading-6 yw-text-sm yw-font-medium yw-rounded-lg"
      :class="[
        time.startTime === selectedTime ? 'yw-bg-black yw-text-white' : 'hover:yw-bg-[#F2F2F2] yw-cursor-pointer'
      ]"
      @click="select(time.startTime)"
    >
      {{ time.startTime }}
    </div>
  </div>
</template>
