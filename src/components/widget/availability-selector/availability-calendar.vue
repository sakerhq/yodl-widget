<script>
import { DateTime, Info } from 'luxon'

export default {
  name: 'AvailabilityCalendar',
  props: {
    selectedDate: { type: String, default: null },
    availabilities: { type: Array, default: () => [] },
    weekStart: { type: Number, default: 0 }, // 0 - Sunday, 1 - Monday
    timeZone: { type: String, required: true }
  },
  data() {
    return {
      calendarDate: null
    }
  },
  computed: {
    periodTile() {
      const firstDay = DateTime.local(this.calendarDate.year, this.calendarDate.month, 1).setLocale('en')

      return `${firstDay.monthLong} ${firstDay.year}`
    },
    weekdays() {
      const weekDays = Info.weekdays('short', { locale: 'en' })

      if (this.weekStart === 0) {
        weekDays.unshift(weekDays.pop())
      }

      return weekDays
    },
    today() {
      return DateTime.local().setZone(this.timeZone)
    },
    availableDays() {
      if (!this.availabilities || !this.availabilities.length) {
        return []
      }

      return this.availabilities.map((date) => {
        return `${date.year}-${date.month}-${date.day}`
      })
    },
    days() {
      const firstDay = DateTime.local(this.calendarDate.year, this.calendarDate.month, 1)
      let firstDayPosition = firstDay.weekday

      if (this.weekStart === 0 && firstDayPosition === 7) {
        firstDayPosition = 0
      }

      const lastDay = firstDay.plus({ months: 1 }).minus({ days: 1 })
      let lastDayPosition = lastDay.weekday

      if (this.weekStart === 0 && lastDayPosition === 7) {
        lastDayPosition = 0
      }

      const daysBeforeFirst = this.weekStart === 1 ? firstDayPosition - 1 : firstDayPosition
      const daysAfterLast = this.weekStart === 1 ? 7 - lastDayPosition : 6 - lastDayPosition

      const monthDays = []

      for (let i = daysBeforeFirst; i > 0; i--) {
        monthDays.push(null)
      }

      for (let i = 0; i < firstDay.daysInMonth; i++) {
        const dateObject = firstDay.plus({ days: i })
        monthDays.push(this.createCalendarDayObject(dateObject))
      }

      for (let i = 1; i <= daysAfterLast; i++) {
        monthDays.push(null)
      }

      return monthDays
    },
    disableBackArrow() {
      return this.calendarDate.month <= this.today.month && this.calendarDate.year === this.today.year
    }
  },
  methods: {
    createCalendarDayObject(dateObject) {
      return {
        date: dateObject.toObject(),
        number: dateObject.day,
        // isCurrentDate: dateObject.hasSame(this.today, 'day'),
        isSelectedDay: this.selectedDate === dateObject.toISODate(),
        isDisabled: !this.availableDays.includes(dateObject.toISODate())
      }
    },
    dayStyleClasses(day) {
      const classes = []

      if (day.isDisabled) {
        classes.push('day--disabled')
      } else if (day.isSelectedDay) {
        classes.push('day--selected')
      }

      return classes.join(' ')
    },
    previous() {
      if (this.disableBackArrow) return

      this.calendarDate = DateTime.fromObject(this.calendarDate).minus({ months: 1 }).toObject()
    },
    next() {
      this.calendarDate = DateTime.fromObject(this.calendarDate).plus({ months: 1 }).toObject()
    },
    selectDay(dateObject) {
      const date = DateTime.fromObject(dateObject).toISODate()
      this.$emit('on-select', date)
    }
  },
  watch: {
    selectedDate: {
      handler(value) {
        if (value) {
          this.calendarDate = DateTime.fromISO(value).setZone(this.timeZone).toObject()
        } else {
          this.calendarDate = DateTime.local().setZone(this.timeZone).toObject()
        }
      },
      immediate: true
    }
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-5">
      <button
        type="button"
        class="w-7 h-7 rounded-md bg-wild-sand flex justify-center items-center"
        :class="{'pointer-events-none opacity-40': disableBackArrow}"
        @click="previous"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
      </button>

      <div class="text-lg font-semibold">{{ periodTile }}</div>

      <button type="button" class="w-7 h-7 rounded-md bg-wild-sand flex justify-center items-center" @click="next">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
      </button>
    </div>

    <div class="relative grid grid-cols-7 gap-x-6 gap-y-5">
      <div v-for="weekday in weekdays" :key="weekday">
        <div class="text-sm leading-5 font-semibold text-center opacity-60">{{ weekday }}</div>
      </div>

      <div v-for="(day, index) in days" :key="index" class="flex justify-center">
        <div v-if="day" class="day w-6 h-6 flex justify-center items-center cursor-pointer" :class="dayStyleClasses(day)" @click="selectDay(day.date)">
          <div class="text-sm leading-5 font-medium text-center">{{ day.number }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.day {
  @apply relative z-10;

  &:hover {
    &::before {
      @apply absolute -top-3 -left-3 w-12 h-12 border-2 border-black rounded-full z-[-1];

      content: '';
    }
  }
}
.day--disabled {
  @apply pointer-events-none opacity-30 line-through;
}

.day--selected {
  @apply text-white pointer-events-none;

  &::before {
    @apply absolute -top-3 -left-3 w-12 h-12 bg-black rounded-full z-[-1];

    content: '';
  }
}

/* .day--current {
  position: relative;
}

.day--current::after {
  display: block;
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: rgb(239, 68, 68);
  position: absolute;
  bottom: 0.125rem;
  left: 50%;
  margin-left: -0.125rem;
  content: '';
}
.day--available {
  border-color: rgb(239, 68, 68);
  cursor: pointer;
  pointer-events: auto;
}

.day--available:hover {
  background-color: rgba(239, 68, 68, 0.1);
} */

/* .day--selected {
  border-color: rgb(79, 70, 229);
  background-color: rgb(79, 70, 229);
} */

/* .day--selected:hover {
  background-color: rgb(55, 48, 163);
} */
</style>
