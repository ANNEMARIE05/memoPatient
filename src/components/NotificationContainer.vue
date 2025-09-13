<template>
  <div class="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
    <NotificationToast
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      :duration="notification.duration"
      @close="removeNotification(notification.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NotificationToast from './NotificationToast.vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration: number
}

const notifications = ref<Notification[]>([])

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Date.now().toString()
  notifications.value.push({ ...notification, id })
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Expose methods for parent components
defineExpose({
  addNotification
})
</script>
