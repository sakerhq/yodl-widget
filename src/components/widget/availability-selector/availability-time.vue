<script>
export default {
  name: 'AvailabilityTime',
  props: {
    timeSlots: { type: Array, default: () => [] },
    selectedTime: { type: String, default: null }
  },
  computed: {
    availableTimeSlots() {
      return this.timeSlots.filter(timeSlot => timeSlot.status === 'available')
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
  <div class="space-y-3 overflow-y-auto">
    <div
      v-for="time in availableTimeSlots"
      :key="time.startTime"
      class="py-2 px-4 leading-6 font-medium rounded-lg"
      :class="[time.startTime === selectedTime ? 'bg-black text-white' : 'hover:bg-[#F2F2F2] cursor-pointer']"
      @click="select(time.startTime)"
    >
      {{ time.startTime }}
    </div>
  </div>
</template>
