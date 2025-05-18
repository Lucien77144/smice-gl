<template>
  <div class="loader t-25">
    <Vue3Lottie
      ref="lottieAnimation"
      :animationData="loadingLottie"
      :autoplay="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from 'vue3-lottie'
import loadingLottie from '~/assets/data/lottie/loader.json'

// Refs
const lottieAnimation = ref<InstanceType<typeof Vue3Lottie>>()

// Props
const props = defineProps<{
  progress: number
}>()

// When progress change :
watch(
  () => props.progress,
  (value) => {
    const animationDuration = lottieAnimation?.value?.getDuration() || 0
    const newFrame = (value / 100) * animationDuration
    lottieAnimation.value?.goToAndStop(newFrame, true)
  }
)
</script>

<style src="./style.scss" lang="scss" scoped></style>
