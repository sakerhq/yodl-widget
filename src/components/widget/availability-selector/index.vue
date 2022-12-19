<script>
import AvailabilityCalendar from './availability-calendar.vue'
import AvailabilityTime from './availability-time.vue'

export default {
  name: 'AvailabilitySelector',
  props: {
    availabilities: { type: Array, default: () => [] },
    datetime: { type: Object, required: true },
    durations: { type: Array, default: () => [] },
    modal: { type: Boolean, default: false },
    selectedDuration: { type: Object, default: null },
    timeZone: { type: String, required: true }
  },
  components: {
    AvailabilityCalendar,
    AvailabilityTime
  },
  data() {
    return {
      selectedDate: null,
      selectedTime: null
    }
  },
  computed: {
    availableTimeSlots() {
      const index = this.availabilities.findIndex((availability) => {
        return `${availability.year}-${availability.month}-${availability.day}` === this.selectedDate
      })

      if (index !== -1) {
        return this.availabilities[index].availabilitySequence
      }

      return []
    }
  },
  methods: {
    selectDate(date) {
      this.selectedDate = date
    },
    selectTime(time) {
      this.selectedTime = time
    },
    clear() {
      this.$emit('on-confirm', { date: null, time: null })
    },
    apply() {
      this.$emit('on-confirm', { date: this.selectedDate, time: this.selectedTime })
    }
  },
  watch: {
    datetime: {
      handler(value) {
        this.selectedDate = value.date
        this.selectedTime = value.time
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <AvailabilityCalendar
      :selected-date="selectedDate"
      :availabilities="availabilities"
      :time-zone="timeZone"
      class="flex-shrink-0 p-5"
      @on-select="selectDate"
    />

    <div class="flex-1 flex flex-col h-0 max-h-full">
      <div class="relative h-64 lg:h-full flex flex-col p-5 pb-0 border-t overflow-auto">
        <p class="flex-shrink-0 pb-2 px-2 font-semibold">Select Time</p>
        <AvailabilityTime
          :selected-time="selectedTime"
          :time-slots="availableTimeSlots"
          class="flex-1 p-0 pb-3 overflow-auto"
          @on-select="selectTime"
        />
      </div>
    </div>

    <div class="flex-shrink-0 flex justify-between" :class="{ 'p-5': modal }">
      <button type="button" class="leading-6 text-sm font-semibold underline" @click="clear">cancel</button>
      <button type="button" class="ml-8 px-5 py-2 rounded-lg bg-black text-white leading-6" @click="apply">
        Apply
      </button>
    </div>
  </div>
</template>
