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
  <button class="w-7 h-7 cursor-pointer" @click="close">
    <svg
      class="inline w-7 h-7 hover:text-[#FF385C] transition-colors duration-300 cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label="Exit"
      role="img"
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path
        fill="currentColor"
        d="M19.03 6.03l-1.06-1.06L12 10.94 6.03 4.97 4.97 6.03 10.94 12l-5.97 5.97 1.06 1.06L12 13.06l5.97 5.97 1.06-1.06L13.06 12l5.97-5.97z"
      ></path>
    </svg>
  </button>
</template>
