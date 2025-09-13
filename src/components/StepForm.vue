<template>
  <div class="max-w-5xl mx-auto min-h-screen flex flex-col">
    <!-- En-tête avec titre à gauche et actions à droite -->
    <div class="bg-white shadow rounded-lg p-4 mb-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <!-- Titre à gauche -->
        <h1 class="text-xl font-bold text-gray-900">
          {{ title }}
        </h1>
        
        <!-- Actions à droite -->
        <div class="flex items-center space-x-3">
          <button @click="goBack" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors">
            <font-awesome-icon icon="arrow-left" class="mr-2" />
            Retour
          </button>
          <button @click="handleSubmit" :disabled="isLoading" type="button" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm transition-colors">
            <font-awesome-icon v-if="isLoading" icon="spinner" class="mr-2 animate-spin" />
            {{ isLoading ? 'Enregistrement...' : submitText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Indicateur de progression -->
    <div class="bg-white shadow rounded-lg p-4 mb-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 overflow-x-auto">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center flex-shrink-0">
            <div 
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                currentStep >= index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span 
              :class="[
                'ml-1 text-xs font-medium whitespace-nowrap',
                currentStep >= index ? 'text-blue-600' : 'text-gray-500'
              ]"
            >
              {{ step.title }}
            </span>
            <font-awesome-icon 
              v-if="index < steps.length - 1" 
              icon="chevron-right" 
              class="mx-2 text-gray-400 text-xs"
            />
          </div>
        </div>
        <div class="text-xs text-gray-500 flex-shrink-0">
          Étape {{ currentStep + 1 }}/{{ steps.length }}
        </div>
      </div>
    </div>

    <!-- Contenu des étapes -->
    <div class="bg-white shadow rounded-lg p-4">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">
          {{ steps[currentStep].title }}
        </h2>
        <p class="text-gray-600 text-sm">
          {{ steps[currentStep].description }}
        </p>
      </div>

      <!-- Contenu de l'étape actuelle -->
      <div class="mb-4">
        <slot :name="`step-${currentStep}`" :step="steps[currentStep]" :form="form" />
      </div>

      <!-- Navigation entre les étapes -->
      <div class="flex justify-between pt-4 border-t border-gray-200">
        <button 
          v-if="currentStep > 0"
          @click="previousStep" 
          type="button"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center text-sm transition-colors"
        >
          <font-awesome-icon icon="chevron-left" class="mr-2" />
          Précédent
        </button>
        <div v-else></div>

        <button 
          v-if="currentStep < steps.length - 1"
          @click="nextStep" 
          type="button"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center text-sm transition-colors"
        >
          Suivant
          <font-awesome-icon icon="chevron-right" class="ml-2" />
        </button>
        <div v-else></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step {
  title: string
  description: string
  fields: string[]
}

interface Props {
  title: string
  steps: Step[]
  form: any
  isLoading?: boolean
  submitText?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  submitText: 'Enregistrer'
})

const emit = defineEmits<{
  submit: []
  back: []
}>()

const currentStep = ref(0)

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const goBack = () => {
  emit('back')
}

const handleSubmit = () => {
  emit('submit')
}
</script>
