<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-6">
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <router-link 
        v-if="index < breadcrumbs.length - 1"
        :to="item.path" 
        class="hover:text-blue-600 transition-colors"
      >
        {{ item.label }}
      </router-link>
      <span 
        v-else
        class="text-gray-900 font-medium"
      >
        {{ item.label }}
      </span>
      <font-awesome-icon 
        v-if="index < breadcrumbs.length - 1"
        icon="chevron-right" 
        class="text-xs" 
      />
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
  label: string
  path: string
}

interface Props {
  items: BreadcrumbItem[]
}

const props = defineProps<Props>()

const breadcrumbs = computed(() => props.items)
</script>
