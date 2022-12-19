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
  <div class="space-y-1.5 overflow-y-auto">
    <div
      v-for="time in availableTimeSlots"
      :key="time.startTime"
      class="px-3 py-1.5 leading-6 text-sm font-medium rounded-lg"
      :class="[time.startTime === selectedTime ? 'bg-black text-white' : 'hover:bg-[#F2F2F2] cursor-pointer']"
      @click="select(time.startTime)"
    >
      {{ time.startTime }}
    </div>
  </div>
</template>
