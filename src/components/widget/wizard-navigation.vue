<script>
import BackButton from '@/components/shared/back-button.vue'
import CloseButton from '@/components/shared/close-button.vue'
import LogoIcon from '@/components/shared/logo-icon.vue'

export default {
  props: {
    logo: { type: Boolean, required: false, default: true },
    previous: { type: Boolean, required: false, default: true }
  },
  components: {
    BackButton,
    CloseButton,
    LogoIcon
  },
  methods: {
    onExit() {
      this.$emit('on-exit')
    },
    onPrevious() {
      this.$emit('on-previous')
    }
  }
}
</script>

<template>
  <div :class="[previous ? 'yw-justify-between' : 'yw-justify-end', 'yw-flex yw-items-center yw-w-full']">
    <BackButton v-if="previous" @on-click="onPrevious" class="yw-bg-transparent" />
    <LogoIcon v-if="logo" class="yw-w-16" />
    <CloseButton @on-click="onExit" class="yw-bg-transparent" />
  </div>
</template>
