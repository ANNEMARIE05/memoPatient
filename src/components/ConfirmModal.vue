<template>
  <!-- Modal backdrop -->
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div
        class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-8 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <font-awesome-icon icon="exclamation-triangle" class="text-red-600 text-xl" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h3>
          </div>
          <button
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <font-awesome-icon icon="times" class="text-lg" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <p class="text-gray-600 mb-8 text-lg">
            {{ message }}
          </p>
          
          <!-- Actions -->
          <div class="flex justify-end space-x-4">
            <button
              @click="$emit('cancel')"
              class="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="$emit('confirm')"
              class="px-6 py-3 text-base font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmer l\'action',
  message: 'Êtes-vous sûr de vouloir continuer ?',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('cancel')
  }
}
</script>
