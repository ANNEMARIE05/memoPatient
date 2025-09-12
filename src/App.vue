<template>
  <div id="app">
    <router-view />
    <NotificationContainer ref="notificationContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NotificationContainer from './components/NotificationContainer.vue'

const notificationContainer = ref()

// Global notification function
const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration = 5000) => {
  notificationContainer.value?.addNotification({ type, title, message, duration })
}

// Make it available globally
window.showNotification = showNotification
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>