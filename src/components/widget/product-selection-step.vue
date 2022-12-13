<script>
import BaseAvatar from '@/components/shared/base-avatar.vue'
import CloseButton from '@/components/shared/close-button.vue'
import ProductCard from '@/components/widget/product-card.vue'
import WizardNavigation from '@/components/widget/wizard-navigation.vue'
import { useWidgetStore } from '@/store/widget.js'
import { mapState } from 'pinia'
import { DateTime } from 'luxon'
import { AVAILABILITY_DAY_LIMIT } from '@/utils/constants'

export default {
  name: 'ProductSelectionStep',
  components: {
    CloseButton,
    ProductCard,
    BaseAvatar,
    WizardNavigation
  },
  computed: {
    ...mapState(useWidgetStore, {
      duration: 'duration',
      selection: 'product',
      user: 'user',
      timeZone: 'timeZone'
    }),
    products() {
      return this.user.products
    }
  },
  methods: {
    select(product) {
      this.store.$patch((state) => {
        state.duration = product.prices[0]
        state.product = product
      })

      const startDate = DateTime.local().toISODate()
      // TODO: Make sure end date time is in time zone
      const endDate = DateTime.local().plus({ days: AVAILABILITY_DAY_LIMIT }).toISODate()

      this.store.getAvailabilities({
        priceId: this.duration.id,
        startDate,
        endDate,
        timeZone: this.timeZone
      })
    },
    unmount() {
      this.$emit('on-unmount')
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <WizardNavigation
      class="p-4 pt-5"
      :logo="false"
      :previous="false"
      @on-exit="$emit('on-exit')"
      @on-previous="$emit('on-previous')"
    />
    <div class="flex-shrink-0">
      <div v-if="user" class="py-8 px-6">
        <BaseAvatar :avatar="user.avatar" :title="user.name" size="80px" class="mx-auto mb-2" />
        <div class="font-medium text-lg whitespace-nowrap overflow-hidden text-ellipsis text-center">
          {{ user.name }}
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 pb-4 overflow-y-auto">
      <div class="px-4 space-y-3">
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
      <div class="px-4 mb-5">
        <div class="leading-6 text-[12px] text-center px-2 mb-4">
          <span class="block font-light text-[#696969]"> By selecting “continue” you agree to our </span>
          <a target="blank" href="https://yodl.to/learn/privacy-policy" class="underline"> Privacy Policy</a>
          and
          <a target="blank" href="https://yodl.to/learn/terms-of-service" class="underline"> Terms of Service</a>.
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
