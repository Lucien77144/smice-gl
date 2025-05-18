<template>
  <div
    ref="headerRef"
    class="header-container default flex items-center justify-between"
  >
    <img
      ref="logoRef"
      class="header-logo default"
      src="/img/logo.svg"
      :alt="$t('TITLE')"
    />
    <div
      ref="navRef"
      class="header-nav"
      :style="{
        opacity: 0,
      }"
    >
      <UIBtnRainbow
        class="text-primary"
        background-color="var(--body)"
        @click="goToLogin"
      >
        <span>{{ $t('LOGIN') }}</span>
        <Icon class="ml-1" icon="tabler:login-2" :ssr="true" />
      </UIBtnRainbow>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap'
import { Icon } from '@iconify/vue'

// Refs
const logoRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const navRef = ref<HTMLElement>()

// Methods
const goToLogin = () => window.open('https://app.smice.com/', '_blank')

// On component mounted, animate the header
onMounted(() => {
  const tl = gsap.timeline()
  const duration = 0.75
  const ease = 'power2.inOut'
  const padding = ['1rem', '2rem']
  const logoHeight = navRef.value.clientHeight
  const logoWidth = '152px'

  // Transition to Header
  tl.to(
    logoRef.value,
    {
      duration,
      ease,
      height: logoHeight,
      width: logoWidth,
      top: padding[0],
      left: padding[1],
      onUpdate: () => {
        const progress = tl.progress()
        const progSin = Math.sin(progress * Math.PI) * 0.25

        const translate = -50 * (1 - progress)
        logoRef.value.style.transform = `
		translate(${translate}%, ${translate}%)
		scale(${1 + progSin})`
      },
      onComplete: () => {
        logoRef.value.classList.remove('default')
        logoRef.value.style.transform = null
        logoRef.value.style.top = null
        logoRef.value.style.left = null
      },
    },
    0
  )
  tl.to(
    headerRef.value,
    {
      duration,
      ease,
      padding: `${padding[0]} ${padding[1]}`,
      height: `calc(${logoHeight} + ${padding[0]} * 2)`,
      backgroundColor: '#15151500',
      onStart: () => {
        headerRef.value.classList.remove('default-bg')
      },
      onComplete: () => {
        headerRef.value.classList.remove('default')
      },
    },
    0
  )

  const navTl = gsap.timeline()
  navTl.to(
    navRef.value,
    {
      duration: 0.25,
      ease,
      opacity: 1,
      height: 'auto',
      onComplete: () => {
        // Clean up any remaining inline styles
        headerRef.value.style.height = null
      },
    },
    1
  )
})
</script>

<style src="./style.scss" lang="scss" scoped></style>
