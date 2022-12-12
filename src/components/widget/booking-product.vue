<script>
import { useWidgetStore } from '@/store/widget'
import { mapState } from 'pinia'

export default {
  name: 'BookingProduct',
  props: {
    products: { type: Array, default: () => [] }
  },
  data() {
    return {
      showSelector: false
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      selectedProduct: 'product'
    })
  },
  methods: {
    openSelector() {
      this.showSelector = true
    },
    closeSelector() {
      this.showSelector = false
    },
    selectProduct(product) {
      this.store.$patch((state) => {
        state.product = product
        state.duration = product.prices[0]
        state.date = null
        state.time = null
      })

      this.closeSelector()
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div class="relative">
    <div class="cursor-pointer relative pl-3 pr-10 py-2" @click="openSelector">
      <div class="text-[10px] leading-4 font-bold uppercase tracking-wider mb-0.5">Services</div>
      <div class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
        {{ selectedProduct.name }}
      </div>
      <ArrowDownIcon class="absolute top-1/2 -mt-2 right-4 w-4 h-4 text-black" />
    </div>

    <BaseCloseOverlay v-if="showSelector" class="z-40" @close-click="closeSelector" />
    <div
      v-if="showSelector"
      class="a-shadow absolute top-0 left-0 lg:left-auto lg:top-full w-full max-w-full lg:max-w-none p-3 bg-white rounded-lg z-50"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="px-4 py-2 mb-3 last:mb-0 rounded-lg text-sm font-medium leading-6"
        :class="[
          selectedProduct && product.id === selectedProduct.id
            ? 'bg-black text-white pointer-events-none'
            : 'hover:bg-[#F2F2F2] cursor-pointer'
        ]"
        @click="selectProduct(product)"
      >
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
