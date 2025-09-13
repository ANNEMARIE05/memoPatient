<template>
  <Layout :title="title">
    <StepForm
      :title="title"
      :steps="steps"
      :form="form"
      :is-loading="isLoading"
      :submit-text="submitText"
      @submit="handleSubmit"
      @back="goBack"
    >
      <!-- Rendu dynamique des étapes -->
      <template v-for="(step, stepIndex) in steps" :key="stepIndex" #[`step-${stepIndex}`]="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <template v-for="field in step.fields" :key="field">
            <OptimizedInput
              v-if="fieldConfigs[field]"
              v-model="form[field]"
              v-bind="fieldConfigs[field]"
              :size="getFieldSize(field)"
            />
          </template>
        </div>
      </template>
    </StepForm>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Layout from './Layout.vue'
import StepForm from './StepForm.vue'
import OptimizedInput from './OptimizedInput.vue'

interface Step {
  title: string
  description: string
  fields: string[]
}

interface FieldConfig {
  type: 'text' | 'email' | 'tel' | 'date' | 'time' | 'select' | 'textarea'
  label: string
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string | number; label: string }>
  rows?: number
  help?: string
}

interface Props {
  title: string
  steps: Step[]
  form: Record<string, any>
  isLoading?: boolean
  submitText?: string
  fieldConfigs: Record<string, FieldConfig>
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  submitText: 'Enregistrer'
})

const emit = defineEmits<{
  submit: []
  back: []
}>()

// Détermine la taille optimale pour chaque champ
const getFieldSize = (field: string): 'sm' | 'md' | 'lg' | 'full' => {
  const config = props.fieldConfigs[field]
  if (!config) return 'md'
  
  // Champs qui peuvent être plus petits
  if (['date', 'time', 'tel'].includes(config.type)) {
    return 'sm'
  }
  
  // Champs qui peuvent être moyens
  if (['text', 'email', 'select'].includes(config.type)) {
    return 'md'
  }
  
  // Champs qui peuvent être plus grands
  if (config.type === 'textarea') {
    return 'lg'
  }
  
  return 'md'
}

const handleSubmit = () => {
  // Émission de l'événement submit
  emit('submit')
}

const goBack = () => {
  // Émission de l'événement back
  emit('back')
}
</script>
