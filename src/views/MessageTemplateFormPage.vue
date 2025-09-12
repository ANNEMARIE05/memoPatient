<template>
  <Layout :title="isEdit ? 'Modifier un modèle de message' : 'Créer un modèle de message'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/message-templates" class="hover:text-blue-600">Modèles de messages</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">{{ isEdit ? 'Modifier' : 'Créer' }}</span>
        </nav>
      </div>

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier le modèle de message' : 'Nouveau modèle de message' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Informations du modèle -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom du modèle <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Rappel de rendez-vous"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de message <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.messageType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description du modèle et de son utilisation"
            ></textarea>
          </div>

          <!-- Contenu du message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contenu du message <span class="text-red-500">*</span>
            </label>
            <div class="border border-gray-300 rounded-md">
              <div class="px-3 py-2 bg-gray-50 border-b border-gray-300 text-xs text-gray-600">
                Variables disponibles : {patient_name}, {appointment_date}, {appointment_time}, {doctor_name}, {clinic_name}
              </div>
              <textarea
                v-model="form.content"
                rows="8"
                required
                class="w-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Bonjour {patient_name}, votre rendez-vous est prévu le {appointment_date} à {appointment_time} avec Dr. {doctor_name}."
              ></textarea>
            </div>
          </div>

          <!-- Paramètres -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Longueur maximale (caractères)
              </label>
              <input
                v-model.number="form.maxLength"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="160"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
          </div>

          <!-- Aperçu -->
          <div v-if="form.content">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Aperçu du message
            </label>
            <div class="bg-gray-50 border border-gray-300 rounded-md p-4">
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
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link
              to="/message-templates"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
import { messageTemplateService } from '../services/messageTemplateService'
import type { MessageTemplate } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

const form = ref({
  name: '',
  messageType: '',
  description: '',
  content: '',
  maxLength: 160,
  status: 'active'
})

// Aperçu du message avec des données d'exemple
const previewMessage = computed(() => {
  if (!form.value.content) return ''
  
  return form.value.content
    .replace(/{patient_name}/g, 'Marie Dubois')
    .replace(/{appointment_date}/g, '15/12/2024')
    .replace(/{appointment_time}/g, '14h30')
    .replace(/{doctor_name}/g, 'Dr. Martin')
    .replace(/{clinic_name}/g, 'Clinique Memo Patient')
})

// Charger les données du modèle en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.uuid) {
    const template = messageTemplateService.getMessageTemplateById(route.params.uuid as string)
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
        status: form.value.status
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
