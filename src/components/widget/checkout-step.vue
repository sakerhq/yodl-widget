<script>
import CloseButton from '@/components/shared/close-button.vue'

export default {
  name: 'CheckoutStep',
  props: {
    state: { type: Object, required: true }
  },
  components: {
    CloseButton
  },
  methods: {
    Unmount() {
      this.$emit('on-unmount')
    }
  }
}
</script>

<template>
  <div>payment</div>
</template>
