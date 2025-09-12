<template>
  <div class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
    <div class="p-4">
      <!-- Header -->
      <div class="text-center mb-4">
        <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-gray-600 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Chart -->
      <div class="relative w-32 h-32 mx-auto mb-4">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="8"
          />
          <circle
            v-for="(segment, index) in segments"
            :key="index"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            :stroke="segment.color"
            stroke-width="8"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="segment.offset"
            stroke-linecap="round"
            class="transition-all duration-1000"
          />
        </svg>
        
        <!-- Center Text -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <p class="text-xs text-gray-600">Total</p>
            <p class="text-lg font-bold text-gray-900">{{ total }}</p>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="space-y-2">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <div :class="item.color" class="w-3 h-3 rounded-full mr-2"></div>
            <span class="text-xs text-gray-700">{{ item.label }}</span>
          </div>
          <span class="text-xs font-medium text-gray-900">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartData {
  label: string
  value: number
  color: string
}

interface Props {
  title: string
  subtitle?: string
  data: ChartData[]
}

const props = defineProps<Props>()

const circumference = 2 * Math.PI * 40 // radius = 40

const total = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0)
})

const segments = computed(() => {
  let cumulativePercentage = 0
  
  return props.data.map((item, index) => {
    const percentage = (item.value / total.value) * 100
    const offset = circumference - (percentage / 100) * circumference
    
    const segment = {
      color: item.color,
      offset: offset,
      percentage: percentage
    }
    
    cumulativePercentage += percentage
    return segment
  })
})
</script>
