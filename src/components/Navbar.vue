<template>
  <header class="bg-white border-b-2 border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">

        <!-- User Menu -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-300 flex items-center justify-center">
            <font-awesome-icon icon="user" class="text-gray-600" />
          </div>
          <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
        </div>

        <!-- Action Buttons -->
        <div v-if="actionButtons && actionButtons.length > 0" class="flex space-x-2">
          <button
            v-for="button in actionButtons"
            :key="button.label"
            @click="button.action"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              button.type === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            ]"
          >
            <font-awesome-icon v-if="button.icon" :icon="button.icon" class="mr-2" />
            {{ button.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="tabs.length > 0" class="mt-4">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="[
            'pb-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.name
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
          @click="$emit('tab-change', tab.name)"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tab {
  name: string
  path?: string
}

interface ActionButton {
  label: string
  icon?: string
  action: () => void
  type?: 'primary' | 'secondary'
}

interface Props {
  title: string
  subtitle?: string
  tabs?: Tab[]
  activeTab?: string
  actionButtons?: ActionButton[]
  notificationCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  activeTab: '',
  actionButtons: () => [],
  notificationCount: 3
})

defineEmits<{
  'tab-change': [tabName: string]
}>()

const user = computed(() => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : { name: 'Utilisateur', email: 'user@example.com' }
})
</script>
