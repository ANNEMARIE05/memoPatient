<template>
  <div class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <div :class="iconBgClass" class="w-10 h-10 flex items-center justify-center">
            <font-awesome-icon :icon="icon" :class="iconClass" class="text-lg" />
          </div>
          <div class="ml-3">
            <h3 class="text-xs font-medium text-gray-600">{{ title }}</h3>
            <p class="text-xl font-bold text-gray-900">{{ value }}</p>
          </div>
        </div>
        <div v-if="change" class="text-right">
          <div :class="changeClass" class="flex items-center text-xs font-medium">
            <font-awesome-icon :icon="changeIcon" class="mr-1" />
            {{ change }}
          </div>
          <p class="text-xs text-gray-500 mt-1">vs semaine dernière</p>
        </div>
      </div>
      
      <!-- Mini Chart -->
      <div v-if="chartData && chartData.length > 0" class="h-8 flex items-end space-x-1">
        <div 
          v-for="(bar, index) in chartData" 
          :key="index"
          :class="barClass"
          :style="{ height: `${bar}%` }"
          class="flex-1 transition-all duration-300 hover:opacity-80"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: string
  iconColor: string
  chartData?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  changeType: 'increase',
  chartData: () => []
})

const iconBgClass = computed(() => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    orange: 'bg-orange-100',
    purple: 'bg-purple-100'
  }
  return colorMap[props.iconColor] || 'bg-gray-100'
})

const iconClass = computed(() => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  }
  return colorMap[props.iconColor] || 'text-gray-600'
})

const changeClass = computed(() => {
  return props.changeType === 'increase' 
    ? 'text-green-600' 
    : 'text-red-600'
})

const changeIcon = computed(() => {
  return props.changeType === 'increase' 
    ? 'arrow-up' 
    : 'arrow-down'
})

const barClass = computed(() => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  }
  return colorMap[props.iconColor] || 'bg-gray-500'
})
</script>
