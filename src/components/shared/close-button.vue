<script>
export default {
  name: 'CloseButton',
  methods: {
    close() {
      this.$emit('on-click')
    }
  }
}
</script>

<template>
  <button
    class="yw-w-7 yw-h-7 hover:yw-text-[#FF385C] yw-transition-colors yw-duration-300 yw-cursor-pointer yw-border-none yw-box-border yw-p-0"
    @click="close"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Exit" role="img">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path
        fill="currentColor"
        d="M19.03 6.03l-1.06-1.06L12 10.94 6.03 4.97 4.97 6.03 10.94 12l-5.97 5.97 1.06 1.06L12 13.06l5.97 5.97 1.06-1.06L13.06 12l5.97-5.97z"
      ></path>
    </svg>
  </button>
</template>
