<template>
  <div v-if="isChromeDevTools">
    <!-- Empty template for Chrome DevTools requests -->
  </div>
  <div v-else>
    <h1>{{ $t('E_404.TITLE') }}</h1>
    <p>{{ $t('E_404.DESCRIPTION') }}</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isChromeDevTools = computed(() =>
  route.path.includes('.well-known/appspecific/com.chrome.devtools.json')
)
</script>
