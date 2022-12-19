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
  <div class="yw-flex yw-flex-col yw-h-full yw-w-full">
    <WizardNavigation
      class="yw-p-4 yw-pt-5 yw-pb-0"
      :logo="false"
      :previous="false"
      @on-exit="$emit('on-exit')"
      @on-previous="$emit('on-previous')"
    />
    <div class="yw-flex-shrink-0">
      <div v-if="user" class="yw-pt-4 yw-pb-8 px-6">
        <BaseAvatar :avatar="user.avatar" :title="user.name" size="80px" class="yw-mx-auto yw-mb-2" />
        <div class="yw-font-medium yw-text-lg yw-whitespace-nowrap yw-overflow-hidden yw-text-ellipsis yw-text-center">
          {{ user.name }}
        </div>
      </div>
    </div>
    <div class="yw-flex-1 yw-min-h-0 yw-pb-4 yw-overflow-y-auto">
      <div class="yw-px-4 yw-space-y-3">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :selected="selection && selection.id === product.id ? true : false"
          @click="select(product)"
        />
      </div>
    </div>
    <div class="yw-flex-shrink-0">
      <div class="yw-h-px yw-bg-[#ebebeb] yw-mb-3"></div>
      <div class="yw-px-4 yw-mb-5">
        <div class="yw-leading-6 yw-text-[12px] yw-text-center yw-px-2 yw-mb-4">
          <span class="yw-block yw-font-light tyw-ext-[#696969]"> By selecting “continue” you agree to our </span>
          <a target="blank" href="https://yodl.to/learn/privacy-policy" class="yw-underline"> Privacy Policy</a>
          and
          <a target="blank" href="https://yodl.to/learn/terms-of-service" class="yw-underline"> Terms of Service</a>.
        </div>
        <button
          type="button"
          class="yw-w-full yw-bg-[#FF385C] yw-text-white yw-rounded-lg yw-px-4 yw-py-3 yw-text-sm yw-leading-6 yw-font-semibold yw-text-center disabled:yw-pointer-events-none disabled:yw-opacity-50"
          @click="$emit('on-next')"
        >
          Set date and time
        </button>
      </div>
    </div>
  </div>
</template>
