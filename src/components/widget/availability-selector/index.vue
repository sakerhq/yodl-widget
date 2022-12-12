<script>
import AvailabilityCalendar from './availability-calendar.vue'
import AvailabilityTime from './availability-time.vue'

export default {
  name: 'AvailabilitySelector',
  props: {
    datetime: { type: Object, required: true },
    availabilities: { type: Array, default: () => [] },
    durations: { type: Array, default: () => [] },
    selectedDuration: { type: Object, default: null },
    timeZone: { type: String, required: true },
    modal: { type: Boolean, default: false }
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

      this.update({ date, time: null })
    },
    selectTime(time) {
      this.selectedTime = time

      if (!this.modal) {
        this.update({ date: this.selectedDate, time: this.selectedTime })
      }
    },
    clear() {
      if (this.modal) {
        this.$emit('on-confirm', { date: null, time: null })
      } else {
        this.update({ date: null, time: null })
      }
    },
    apply() {
      this.$emit('on-confirm', { date: this.selectedDate, time: this.selectedTime })
    },
    update({ date = null, time = null }) {
      this.$emit('on-datetime-change', { date, time })
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
  <div class="flex flex-col lg:flex-none h-full lg:h-auto">
    <div
      :class="[
        modal ? 'border-b' : 'border rounded-lg mb-6',
        'flex-1 lg:flex-none grid grid-cols-11 border-black border-opacity-10'
      ]"
    >
      <AvailabilityCalendar
        :selected-date="selectedDate"
        :availabilities="availabilities"
        :time-zone="timeZone"
        class="col-span-11 lg:col-span-6 p-8 lg:border-r border-black border-opacity-10"
        @on-select="selectDate"
      />
      <div class="col-span-11 lg:col-span-5 flex flex-col">
        <div class="relative h-64 lg:h-full flex flex-col p-5 lg:p-0 border-t lg:border-t-0 overflow-auto">
          <p class="lg:hidden flex-shrink-0 py-2 px-4 text-lg font-semibold">Select Time</p>
          <AvailabilityTime
            :selected-time="selectedTime"
            :time-slots="availableTimeSlots"
            class="lg:absolute lg:inset-0 flex-1 lg:h-full p-0 py-4 lg:p-4 overflow-auto"
            @on-select="selectTime"
          />
        </div>
      </div>
    </div>
    <div class="flex-shrink-0 flex justify-end" :class="{ 'p-4': modal }">
      <button type="button" class="leading-6 font-semibold underline" @click="clear">Clear all</button>
      <button v-if="modal" type="button" class="ml-8 px-5 py-2 rounded-lg bg-black text-white leading-6" @click="apply">
        Apply
      </button>
    </div>
  </div>
</template>
