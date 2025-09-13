<template>
  <div :class="containerClass">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Input text, email, tel -->
    <input
      v-if="type === 'text' || type === 'email' || type === 'tel'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
    />
    
    <!-- Input date -->
    <input
      v-else-if="type === 'date'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="date"
      :required="required"
      :disabled="disabled"
      :class="inputClass"
    />
    
    <!-- Input time -->
    <input
      v-else-if="type === 'time'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="time"
      :required="required"
      :disabled="disabled"
      :class="inputClass"
    />
    
    <!-- Select -->
    <select
      v-else-if="type === 'select'"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :required="required"
      :disabled="disabled"
      :class="inputClass"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    
    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="inputClass"
    ></textarea>
    
    <!-- Message d'erreur -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    
    <!-- Message d'aide -->
    <p v-if="help" class="mt-1 text-sm text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'select' | 'textarea'
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  help?: string
  options?: Option[]
  rows?: number
  size?: 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  rows: 3,
  size: 'md'
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const containerClass = computed(() => {
  const baseClass = 'w-full'
  
  switch (props.size) {
    case 'sm':
      return `${baseClass} max-w-xs`
    case 'md':
      return `${baseClass} max-w-sm`
    case 'lg':
      return `${baseClass} max-w-md`
    case 'full':
      return baseClass
    default:
      return `${baseClass} max-w-sm`
  }
})

const inputClass = computed(() => {
  const baseClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors'
  const errorClass = props.error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
  const disabledClass = props.disabled ? 'bg-gray-50 cursor-not-allowed' : ''
  
  return `${baseClass} ${errorClass} ${disabledClass}`.trim()
})
</script>
