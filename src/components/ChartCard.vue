<template>
  <div class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
          <p v-if="subtitle" class="text-xs text-gray-600 mt-1">{{ subtitle }}</p>
        </div>
        <div v-if="total" class="text-right">
          <p class="text-lg font-bold text-gray-900">{{ total }}</p>
          <div v-if="change" :class="changeClass" class="flex items-center text-xs">
            <font-awesome-icon :icon="changeIcon" class="mr-1" />
            {{ change }}
          </div>
        </div>
      </div>

      <!-- Chart Area -->
      <div class="h-32 flex items-end justify-between space-x-1">
        <div 
          v-for="(bar, index) in chartData" 
          :key="index"
          :class="barClass"
          :style="{ height: `${bar}%` }"
          class="flex-1 transition-all duration-500 hover:opacity-80 cursor-pointer"
          :title="`${months[index]}: ${bar}%`"
        ></div>
      </div>

      <!-- Legend -->
      <div v-if="legend" class="flex items-center justify-center mt-3 space-x-4">
        <div v-for="item in legend" :key="item.label" class="flex items-center">
          <div :class="item.color" class="w-2 h-2 rounded-full mr-2"></div>
          <span class="text-xs text-gray-600">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LegendItem {
  label: string
  color: string
}

interface Props {
  title: string
  subtitle?: string
  total?: string
  change?: string
  changeType?: 'increase' | 'decrease'
  chartData: number[]
  legend?: LegendItem[]
  barColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  changeType: 'increase',
  barColor: 'bg-blue-500'
})

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

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
  return props.barColor
})
</script>
