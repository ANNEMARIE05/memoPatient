<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      :class="[
        'max-w-md w-full shadow-2xl border-l-4 pointer-events-auto overflow-hidden backdrop-blur-sm',
        getNotificationClasses()
      ]"
    >
      <div class="p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              getIconBackgroundClass()
            ]">
              <font-awesome-icon 
                :icon="icon" 
                :class="iconClass"
                class="h-5 w-5"
              />
            </div>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ title }}</p>
            <p class="mt-1 text-sm text-gray-600 leading-relaxed">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="close"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-1 transition-colors"
            >
              <font-awesome-icon icon="times" class="h-4 w-4" />
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
    success: 'bg-white border-green-500 shadow-green-100',
    error: 'bg-white border-red-500 shadow-red-100',
    warning: 'bg-white border-yellow-500 shadow-yellow-100',
    info: 'bg-white border-blue-500 shadow-blue-100'
  }
  return classes[props.type]
}

const getIconBackgroundClass = () => {
  const classes = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
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
