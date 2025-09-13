<template>
  <Layout :title="isEdit ? 'Modifier un modèle de message' : 'Créer un modèle de message'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-4 py-3 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier le modèle de message' : 'Nouveau modèle de message' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
          <!-- Informations du modèle -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom du modèle <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ex: Rappel de rendez-vous"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Type de message <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.messageType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Sélectionnez le type</option>
                <option value="rappel">Rappel de rendez-vous</option>
                <option value="confirmation">Confirmation</option>
                <option value="annulation">Annulation</option>
                <option value="information">Information générale</option>
                <option value="urgence">Urgence</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Description du modèle et de son utilisation"
            ></textarea>
          </div>

          <!-- Longueur maximale -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Longueur maximale (caractères)
            </label>
            <input
              v-model.number="form.maxLength"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="160"
            />
          </div>

          <!-- Sélection des variables -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Variables disponibles
            </label>
            <div class="bg-gray-50 border border-gray-300 rounded-md p-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                <button
                  v-for="variable in availableVariables"
                  :key="variable.key"
                  type="button"
                  @click="insertVariable(variable.key)"
                  class="px-2 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors text-center"
                >
                  {{ variable.label }}
                </button>
              </div>
              <div class="text-xs text-gray-500">
                Cliquez sur une variable pour l'insérer dans le message
              </div>
            </div>
          </div>

          <!-- Contenu du message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contenu du message <span class="text-red-500">*</span>
            </label>
            <div class="border border-gray-300 rounded-md">
              <div class="px-3 py-2 bg-gray-50 border-b border-gray-300 text-xs text-gray-600">
                Utilisez les variables ci-dessus pour personnaliser votre message
              </div>
              <textarea
                v-model="form.content"
                rows="5"
                required
                class="w-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                placeholder="Bonjour Prénom, votre rendez-vous est prévu le Date du RDV à Heure du RDV."
                ref="contentTextarea"
              ></textarea>
            </div>
          </div>

          <!-- Paramètres -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>

          <!-- Aperçu -->
          <div v-if="form.content">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Aperçu du message
            </label>
            <div class="bg-gray-50 border border-gray-300 rounded-md p-3">
              <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ previewMessage }}</div>
              <div class="mt-2 text-xs text-gray-500">
                Longueur: {{ form.content.length }} caractères
                <span v-if="form.maxLength && form.content.length > form.maxLength" class="text-red-500 ml-2">
                  (Dépasse la limite de {{ form.maxLength }} caractères)
                </span>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-between space-x-3 pt-4 border-t border-gray-200">
            <router-link
              to="/message-templates"
              class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {{ loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { messageTemplateService } from '../services/messageTemplateService'
import type { MessageTemplate } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const contentTextarea = ref<HTMLTextAreaElement | null>(null)

const isEdit = computed(() => !!route.params.uuid)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Modèles de messages', path: '/message-templates' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const form = ref({
  name: '',
  messageType: '',
  description: '',
  content: '',
  maxLength: 160,
  status: 'active'
})

// Variables disponibles basées sur les champs des patients
const availableVariables = ref([
  // Informations patient
  { key: 'firstname', label: 'Prénom' },
  { key: 'lastname', label: 'Nom' },
  { key: 'fullname', label: 'Nom complet' },
  { key: 'birthdate', label: 'Date de naissance' },
  { key: 'age', label: 'Âge' },
  { key: 'sexe', label: 'Sexe' },
  { key: 'genre', label: 'Genre' },
  { key: 'phone1', label: 'Téléphone principal' },
  { key: 'phone2', label: 'Téléphone secondaire' },
  { key: 'email', label: 'Email' },
  { key: 'adresse', label: 'Adresse' },
  
  // Informations rendez-vous
  { key: 'appointment_date', label: 'Date du RDV' },
  { key: 'appointment_time', label: 'Heure du RDV' },
  { key: 'appointment_datetime', label: 'Date et heure du RDV' },
  { key: 'doctor_name', label: 'Nom du médecin' },
  { key: 'clinic_name', label: 'Nom de la clinique' },
  
  // Informations système
  { key: 'current_date', label: 'Date actuelle' },
  { key: 'current_time', label: 'Heure actuelle' }
])

// Fonction pour insérer une variable dans le textarea
const insertVariable = (variableKey: string) => {
  if (!contentTextarea.value) return
  
  const textarea = contentTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  // Trouver le label de la variable
  const variable = availableVariables.value.find(v => v.key === variableKey)
  const variableText = variable ? variable.label : variableKey
  
  // Insérer le nom de la variable à la position du curseur
  const newContent = form.value.content.substring(0, start) + variableText + form.value.content.substring(end)
  form.value.content = newContent
  
  // Repositionner le curseur après la variable insérée
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + variableText.length, start + variableText.length)
  }, 0)
}

// Aperçu du message avec des données d'exemple
const previewMessage = computed(() => {
  if (!form.value.content) return ''
  
  let preview = form.value.content
  
  // Créer un mapping des labels vers les données d'exemple
  const labelToExample: Record<string, string> = {
    'Prénom': 'Marie',
    'Nom': 'Dubois',
    'Nom complet': 'Marie Dubois',
    'Date de naissance': '15/03/1979',
    'Âge': '45 ans',
    'Sexe': 'F',
    'Genre': 'Féminin',
    'Téléphone principal': '06 12 34 56 78',
    'Téléphone secondaire': '06 98 76 54 32',
    'Email': 'marie.dubois@email.com',
    'Adresse': '123 Rue de la Paix, Paris',
    'Date du RDV': '15/12/2024',
    'Heure du RDV': '14h30',
    'Date et heure du RDV': '15/12/2024 à 14h30',
    'Nom du médecin': 'Dr. Martin',
    'Nom de la clinique': 'Clinique Memo Patient',
    'Date actuelle': new Date().toLocaleDateString('fr-FR'),
    'Heure actuelle': new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  
  // Remplacer tous les labels de variables trouvés
  Object.keys(labelToExample).forEach(label => {
    const regex = new RegExp(label, 'g')
    preview = preview.replace(regex, labelToExample[label])
  })
  
  return preview
})

// Charger les données du modèle en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.uuid) {
    const template = messageTemplateService.getTemplateById(route.params.uuid as string)
    if (template) {
      form.value = {
        name: template.name || '',
        messageType: template.messageType || '',
        description: template.description || '',
        content: template.content,
        maxLength: template.maxLength || 160,
        status: template.status || 'active'
      }
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isEdit.value && route.params.uuid) {
      // Mode édition
      const updatedTemplate = messageTemplateService.updateMessageTemplate(route.params.uuid as string, {
        name: form.value.name,
        messageType: form.value.messageType,
        description: form.value.description,
        content: form.value.content,
        maxLength: form.value.maxLength,
        status: form.value.status
      })
      
      if (updatedTemplate) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Modèle de message mis à jour avec succès')
        }
        router.push('/message-templates')
      }
    } else {
      // Mode création
      const newTemplate = messageTemplateService.addMessageTemplate({
        name: form.value.name,
        messageType: form.value.messageType,
        description: form.value.description,
        content: form.value.content,
        maxLength: form.value.maxLength,
        status: form.value.status,
        active: form.value.status === 'active'
      })
      
      if (newTemplate) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Modèle de message créé avec succès')
        }
        router.push('/message-templates')
      }
    }
  } catch (error) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement')
    }
  } finally {
    loading.value = false
  }
}
</script>
