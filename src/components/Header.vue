<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Notifications -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-none transition-colors">
          <font-awesome-icon icon="bell" class="text-xl" />
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        <!-- User Menu -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <font-awesome-icon icon="user" class="text-gray-600" />
          </div>
          <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
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

interface Props {
  title: string
  subtitle?: string
  tabs?: Tab[]
  activeTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  activeTab: ''
})

defineEmits<{
  'tab-change': [tabName: string]
}>()

const user = computed(() => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : { name: 'Utilisateur', email: 'user@example.com' }
})
</script>
