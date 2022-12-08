<script>
import { hash } from '@/utils/string'

const DEFAULT_COLOR = '#F3698B'
const DEFAULT_SIZE = '36px'
const FONT_SIZE_PERCETAGE = 0.3

export default {
  name: 'BaseAvatar',
  props: {
    avatar: { type: String, required: false, default: '' },
    size: { type: String, required: false, default: DEFAULT_SIZE },
    title: { type: String, required: true }
  },
  computed: {
    fontSize() {
      return `${parseInt(parseInt(this.size) * FONT_SIZE_PERCETAGE)}px`
    },
    backgroundColor() {
      let color = DEFAULT_COLOR
      const x = parseInt(hash(this.title).toString().split('')[0])

      switch (x) {
        case 0:
          color = '#F3698B'
          break
        case 1:
          color = '#96D9D5'
          break
        case 2:
          color = '#EFBE75'
          break
        case 3:
          color = '#8488EC'
          break
        case 4:
          color = '#8EBD8A'
          break
        case 5:
          color = '#F3698B'
          break
        case 6:
          color = '#96D9D5'
          break
        case 7:
          color = '#EFBE75'
          break
        case 8:
          color = '#8488EC'
          break
        case 9:
          color = '#8EBD8A'
          break
        default:
          break
      }

      return color
    },
    titleTransformed() {
      return this.title.split(' ')[0].split('')[0]
    }
  }
}
</script>

<template>
  <div :style="`width: ${size}; height: ${size}; min-width: ${size}; min-height: ${size};`" class="relative rounded-full overflow-hidden">
    <div v-if="avatar && avatar.length">
      <img :src="avatar" class="block object-cover" />
    </div>

    <div
      v-else
      :style="`background-color: ${backgroundColor}`"
      class="w-full h-full flex flex-col items-center justify-center"
    >
      <div
        class="text-white font-semibold uppercase"
        :style="`font-size: ${fontSize}`"
      >
        {{ titleTransformed }}
      </div>
    </div>
  </div>
</template>
