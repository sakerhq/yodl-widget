<script>
export default {
  name: 'BackButton',
  methods: {
    previous() {
      this.$emit('on-click')
    }
  }
}
</script>

<template>
  <button 
    class="w-7 h-7 cursor-pointer"
    @click.stop.prevent="previous"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      aria-label="Back" 
      role="img"
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path fill="currentColor" d="M21 11.25H5.81l4.72-4.72-1.06-1.06L2.94 12l6.53 6.53 1.06-1.06-4.72-4.72H21v-1.5z"></path>
    </svg>
  </button>
</template>