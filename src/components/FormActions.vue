<template>
  <div class="flex items-center space-x-3">
    <!-- Bouton Retour -->
    <button 
      @click="$emit('back')" 
      type="button" 
      class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors"
    >
      <font-awesome-icon icon="arrow-left" class="mr-2" />
      Retour
    </button>
    
    <!-- Bouton Annuler (si différent de retour) -->
    <button 
      v-if="showCancel"
      @click="$emit('cancel')" 
      type="button" 
      class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
    >
      Annuler
    </button>
    
    <!-- Bouton Sauvegarder -->
    <button 
      @click="$emit('save')" 
      :disabled="isLoading || disabled"
      type="button" 
      class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm transition-colors"
    >
      <font-awesome-icon v-if="isLoading" icon="spinner" class="mr-2 animate-spin" />
      {{ isLoading ? loadingText : saveText }}
    </button>
    
    <!-- Bouton Sauvegarder et continuer -->
    <button 
      v-if="showSaveAndContinue"
      @click="$emit('save-and-continue')" 
      :disabled="isLoading || disabled"
      type="button" 
      class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm transition-colors"
    >
      <font-awesome-icon v-if="isLoading" icon="spinner" class="mr-2 animate-spin" />
      {{ isLoading ? loadingText : 'Sauvegarder et continuer' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading?: boolean
  disabled?: boolean
  showCancel?: boolean
  showSaveAndContinue?: boolean
  saveText?: string
  loadingText?: string
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  disabled: false,
  showCancel: false,
  showSaveAndContinue: false,
  saveText: 'Enregistrer',
  loadingText: 'Enregistrement...'
})

defineEmits<{
  back: []
  cancel: []
  save: []
  'save-and-continue': []
}>()
</script>
