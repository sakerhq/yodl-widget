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
  <div class="yw-flex yw-flex-col yw-h-full">
    <AvailabilityCalendar
      :selected-date="selectedDate"
      :availabilities="availabilities"
      :time-zone="timeZone"
      class="yw-flex-shrink-0 yw-p-5"
      @on-select="selectDate"
    />

    <div class="yw-flex-1 yw-flex yw-flex-col yw-h-0 yw-max-h-full">
      <div class="yw-relative yw-h-64 lg:yw-h-full yw-flex yw-flex-col yw-p-5 yw-pb-0 yw-border-t yw-overflow-auto">
        <p class="yw-flex-shrink-0 yw-pb-2 yw-px-2 yw-font-semibold">Select Time</p>
        <AvailabilityTime
          :selected-time="selectedTime"
          :time-slots="availableTimeSlots"
          class="yw-flex-1 yw-p-0 yw-pb-3 yw-overflow-auto"
          @on-select="selectTime"
        />
      </div>
    </div>

    <div class="yw-flex-shrink-0 yw-flex yw-justify-between" :class="{ 'yw-p-5': modal }">
      <button type="button" class="yw-leading-6 yw-text-sm yw-font-semibold yw-underline" @click="clear">cancel</button>
      <button
        type="button"
        class="yw-ml-8 yw-px-5 yw-py-2 yw-rounded-lg yw-bg-black yw-text-white yw-leading-6"
        @click="apply"
      >
        Apply
      </button>
    </div>
  </div>
</template>
