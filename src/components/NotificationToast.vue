<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      :class="[
        'max-w-sm w-full shadow-xl border-2 pointer-events-auto overflow-hidden',
        getNotificationClasses()
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <font-awesome-icon 
              :icon="icon" 
              :class="iconClass"
              class="h-6 w-6"
            />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ title }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              :class="[
                'inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2',
                getCloseButtonClasses()
              ]"
            >
              <font-awesome-icon icon="times" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)

const icon = computed(() => {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'information-circle'
  }
  return icons[props.type]
})

const iconClass = computed(() => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[props.type]
})

const getNotificationClasses = () => {
  const classes = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }
  return classes[props.type]
}

const getCloseButtonClasses = () => {
  const classes = {
    success: 'focus:ring-green-500',
    error: 'focus:ring-red-500',
    warning: 'focus:ring-yellow-500',
    info: 'focus:ring-blue-500'
  }
  return classes[props.type]
}

const close = () => {
  show.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  show.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>
