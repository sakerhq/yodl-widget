<script>
import CloseButton from '@/components/shared/close-button.vue'
import ProductCard from '@/components/widget/product-card.vue'
import BaseAvatar from '@/components/shared/base-avatar.vue'

export default {
  name: 'ProductSelectionStep',
  props: {
    state: { type: Object, required: true }
  },
  components: {
    CloseButton,
    ProductCard,
    BaseAvatar
  },
  data() {
    return {
      selection: null
    }
  },
  computed: {
    products() {
      return this.state.products
    },
    user() {
      return this.state.user
    }
  }, 
  methods: {
    select(product) {
      this.selection = product
      
      this.$emit('on-form-update', {
        data: {
          product
        },
        valid: true
      })
    },
    unmount() {
      this.$emit('on-unmount')
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex-shrink-0">
      <div class="flex justify-end mt-4 mr-4">
        <CloseButton @on-close="unmount" />
      </div>
      <div 
        v-if="user" 
        class="py-8 px-6"
      >
        <BaseAvatar 
          :avatar="user.avatar" 
          :title="user.name" 
          size="100px" 
          class="mx-auto mb-2" 
        />
        <div class="font-medium text-xl whitespace-nowrap overflow-hidden text-ellipsis text-center">
          {{ user.name }}
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 pb-4 overflow-y-auto">
      <div class="px-6 space-y-3">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :selected="selection && selection.id === product.id ? true : false"
          @click="select(product)"
        />
      </div>
      
    </div>
    <div class="flex-shrink-0">
      <div class="h-px bg-[#ebebeb] mb-3"></div>
      <div class="px-6 mb-5">
        <div class="leading-6 text-[12px] text-center px-2 mb-4">
          <span class="block text-[#696969]">By selecting “continue” you agree to our</span>
          <a href="#" class="underline">Privacy Policy</a> 
          and 
          <a href="#" class="underline">Terms of Service</a>.
        </div>
        <button 
          type="button" 
          class="w-full bg-[#FF385C] text-white rounded-lg px-4 py-3 text-sm leading-6 font-semibold text-center disabled:pointer-events-none disabled:opacity-50"
          @click="$emit('on-next')"
          >
          Set date and time
        </button>
      </div>
    </div>
  </div>
</template>
