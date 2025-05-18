<template>
  <component
    :is="is"
    :class="
      cn(
        'group relative inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed } from 'vue'

interface RainbowButtonProps {
  class?: string
  is?: string
}

const props = withDefaults(defineProps<RainbowButtonProps>(), {
  is: 'button',
})
</script>

<style src="./style.scss" lang="scss" scoped></style>
