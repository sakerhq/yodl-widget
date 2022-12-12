<script>
import { useWidgetStore } from '@/store/widget'

export default {
  name: 'BookingGuest',
  data() {
    return {
      form: {
        email: '',
        name: ''
      }
    }
  },
  watch: {
    'form.email': {
      handler: function (newValue) {
        this.store.$patch({ email: newValue })
      }
    },
    'form.name': {
      handler: function (newValue) {
        this.store.$patch({ name: newValue })
      }
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div>
    <div class="relative">
      <div class="absolute top-2 left-3 text-[10px] leading-4 font-bold uppercase tracking-wider">Name *</div>
      <input
        v-model.trim="form.name"
        name="name"
        type="text"
        class="w-full px-3 pt-[26px] pb-2 text-sm border-none ring-0 outline-none focus:ring-0 focus:outline-none placeholder-gray-400"
        placeholder="Your name"
      />
    </div>
    <div class="relative border-t border-black border-opacity-10">
      <div class="absolute top-2 left-3 text-[10px] leading-4 font-bold uppercase tracking-wider">Email *</div>
      <input
        v-model.trim="form.email"
        name="email"
        type="text"
        class="w-full px-3 pt-[26px] pb-2 text-sm border-none rounded-bl-md rounded-br-md ring-0 outline-none focus:ring-0 focus:outline-none placeholder-gray-400"
        placeholder="Your email"
      />
    </div>
  </div>
</template>
