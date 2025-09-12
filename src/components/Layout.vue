<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="ml-64 flex flex-col min-h-screen">
      <!-- Header -->
      <div class="fixed top-0 right-0 left-64 z-30">
        <Navbar :title="title" :subtitle="subtitle" :tabs="tabs" :active-tab="activeTab" @tab-change="$emit('tab-change', $event)" />
      </div>

      <!-- Content -->
      <main class="flex-1 p-6 mt-20">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

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

defineProps<Props>()

defineEmits<{
  'tab-change': [tabName: string]
}>()
</script>
