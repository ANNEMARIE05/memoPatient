<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div :class="[
      'flex flex-col min-h-screen transition-all duration-300',
      sidebarCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-64'
    ]">
      <!-- Header -->
      <div :class="[
        'fixed top-0 right-0 left-0 z-30 transition-all duration-300',
        sidebarCollapsed ? 'md:left-16' : 'md:left-64'
      ]">
        <Navbar :title="title" :subtitle="subtitle" :tabs="tabs" :active-tab="activeTab" @tab-change="$emit('tab-change', $event)" />
      </div>

      <!-- Content -->
      <main class="flex-1 p-3 md:p-6 mt-16 md:mt-20">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import { ref, onMounted, onUnmounted } from 'vue'

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

// État de la sidebar
const sidebarCollapsed = ref(false)

// Fonction pour écouter les changements d'état de la sidebar
const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

// S'abonner aux événements de la sidebar
onMounted(() => {
  window.addEventListener('sidebar-toggle', (event: any) => {
    handleSidebarToggle(event.detail.collapsed)
  })
})

onUnmounted(() => {
  window.removeEventListener('sidebar-toggle', (event: any) => {
    handleSidebarToggle(event.detail.collapsed)
  })
})
</script>
