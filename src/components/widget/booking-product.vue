<script>
import ArrowDownIcon from '@/components/shared/arrow-down-icon.vue'
import { useWidgetStore } from '@/store/widget'
import { mapState } from 'pinia'

export default {
  name: 'BookingProduct',
  components: {
    ArrowDownIcon
  },
  props: {
    products: { type: Array, default: () => [] }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState(useWidgetStore, {
      selection: 'product'
    })
  },
  methods: {
    open() {
      this.show = true
    },
    close() {
      this.show = false
    },
    select(product) {
      this.store.$patch({
        product: product,
        duration: product.prices[0],
        date: null,
        time: null
      })
      this.close()
    }
  },
  created() {
    this.store = useWidgetStore()
  }
}
</script>

<template>
  <div class="relative">
    <div class="cursor-pointer relative pl-3 pr-10 py-2" @click="open">
      <div class="text-[10px] leading-4 font-bold uppercase tracking-wider mb-0.5">Services</div>
      <div class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
        {{ selection.name }}
      </div>
      <ArrowDownIcon class="absolute top-1/2 -mt-2 right-4 w-4 h-4 text-black" />
    </div>

    <button
      v-if="show"
      type="button"
      class="fixed inset-0 h-full w-full bg-transparent focus:outline-none cursor-default z-10"
      tabindex="-1"
      @click.stop="close"
    ></button>

    <div
      v-if="show"
      class="a-shadow absolute top-0 left-0 lg:left-auto lg:top-full w-full max-w-full lg:max-w-none p-3 bg-white rounded-lg z-50"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="px-3.5 py-1.5 mb-2 last:mb-0 rounded-lg text-sm font-medium leading-6"
        :class="[
          selection && product.id === selection.id
            ? 'bg-black text-white pointer-events-none'
            : 'hover:bg-[#F2F2F2] cursor-pointer'
        ]"
        @click="select(product)"
      >
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
