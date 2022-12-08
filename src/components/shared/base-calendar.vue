<script>
import { DateTime, Info } from 'luxon'

export default {
  name: 'BaseCalendar',
  props: {
    availabilities: { type: Array, default: () => [] },
    weekStart: { type: Number, default: 0 }, // 0 - Sunday, 1 - Monday
    timeZone: { type: String, required: true }
  },
  data() {
    return {
      calendarDate: null,
      selectedDate: null
    }
  },
  computed: {
    month() {
      const firstDay = DateTime.local(this.calendarDate.year, this.calendarDate.month, 1).setLocale('en')

      return firstDay.monthLong
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
        const dateObject = firstDay.minus({ days: i })
        monthDays.push(this.createCalendarDayObject(dateObject))
      }

      for (let i = 0; i < firstDay.daysInMonth; i++) {
        const dateObject = firstDay.plus({ days: i })
        monthDays.push(this.createCalendarDayObject(dateObject))
      }

      for (let i = 1; i <= daysAfterLast; i++) {
        const dateObject = lastDay.plus({ days: i })
        monthDays.push(this.createCalendarDayObject(dateObject))
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
        isCurrentDate: dateObject.hasSame(this.today, 'day'),
        isSelectedDay: this.selectedDate === dateObject.toISODate(),
        isDisabled: dateObject.month !== this.calendarDate.month,
        isAvailable: this.availableDays.includes(dateObject.toISODate())
      }
    },
    dayStyleClasses(day) {
      const classes = []

      if (day.isDisabled) {
        classes.push('day--disabled')
      } else {
        if (day.isCurrentDate) {
          classes.push('day--current')
        }

        if (day.isSelectedDay) {
          classes.push('day--selected')
        }

        if (day.isAvailable) {
          classes.push('day--available')
        }
      }

      return classes.join(' ')
    },
    previous() {
      if (this.disableBackArrow) return

      this.calendarDate = DateTime.fromObject(this.calendarDate).minus({ months: 1 }).toObject()
      this.$emit('on-period-update', DateTime.fromObject(this.calendarDate).toISODate())
    },
    next() {
      this.calendarDate = DateTime.fromObject(this.calendarDate).plus({ months: 1 }).toObject()
      this.$emit('on-period-update', DateTime.fromObject(this.calendarDate).toISODate())
    },
    selectDay(dateObject) {
      const date = DateTime.fromObject(dateObject).toISODate()
      this.selectedDate = date
      this.$emit('on-select', date)
    }
  },
  created() {
    this.calendarDate = DateTime.local().setZone(this.timeZone).toObject()
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        class="w-7 h-7 rounded-md bg-wild-sand flex justify-center items-center"
        :class="{'pointer-events-none opacity-40': disableBackArrow}"
        @click="previous"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
      </button>

      <div class="text-sm">{{ month }}</div>

      <button type="button" class="w-7 h-7 rounded-md bg-wild-sand flex justify-center items-center" @click="next">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    </div>

    <div class="relative grid grid-cols-7 gap-2">
      <div v-for="weekday in weekdays" :key="weekday" class="mb-1.5">
        <div class="text-xs leading-4 font-semibold text-mortar text-center">{{ weekday }}</div>
      </div>

      <div
        v-for="(day, index) in days"
        :key="index"
        class="w-8 h-8 flex justify-center items-center mx-auto border border-transparent rounded-md pointer-events-none"
        :class="dayStyleClasses(day)"
        @click="selectDay(day.date)"
      >
        <div class="text-sm leading-4 text-center">{{ day.number }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day--disabled {
  pointer-events: none;
  color: rgb(209, 213, 219);
}

.day--current {
  position: relative;
}

.day--current::after {
  display: block;
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: rgb(7239, 68, 68);
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
}

/* .day--selected {
  border-color: rgb(79, 70, 229);
  background-color: rgb(79, 70, 229);
} */

/* .day--selected:hover {
  background-color: rgb(55, 48, 163);
} */
</style>
