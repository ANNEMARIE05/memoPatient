<template>
  <Layout title="Détails de l'historique">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/message-history" class="hover:text-blue-600">Historique des messages</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">Détails</span>
        </nav>
      </div>

      <!-- Contenu principal -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="!message" class="text-center py-8">
        <font-awesome-icon icon="exclamation-triangle" class="text-gray-400 text-4xl mb-4" />
        <p class="text-gray-500">Message non trouvé</p>
      </div>

      <div v-else>
        <!-- En-tête avec actions -->
        <div class="bg-white border border-gray-200 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Message #{{ message.uuid }}
                </h2>
                <p class="text-sm text-gray-500">{{ message.phoneNumber }}</p>
              </div>
              <div class="flex space-x-3">
                <router-link
                  to="/message-history"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <font-awesome-icon icon="arrow-left" class="mr-2" />
                  Retour à la liste
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations du message -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Informations générales -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Informations générales</h3>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">UUID du message</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ message.uuid }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Statut</label>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  messageHistoryService.getStatusClass(message.status || '')
                ]">
                  {{ messageHistoryService.getStatusText(message.status || '') }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Patient</label>
                <p class="mt-1 text-sm text-gray-900">{{ getPatientName(message.patientUuid) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Numéro de téléphone</label>
                <p class="mt-1 text-sm text-gray-900">{{ message.phoneNumber }}</p>
              </div>
            </div>
          </div>

          <!-- Contenu du message -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Contenu du message</h3>
            </div>
            <div class="p-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ message.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations de timing -->
        <div class="mt-6 bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Horodatage</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Créé le</label>
                <p class="mt-1 text-sm text-gray-900">{{ messageHistoryService.formatDate(message.createdAt as Date || null) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Modifié le</label>
                <p class="mt-1 text-sm text-gray-900">{{ messageHistoryService.formatDate(message.updatedAt as Date || null) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Envoyé le</label>
                <p class="mt-1 text-sm text-gray-900">{{ messageHistoryService.formatDate(message.sentAt || null) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Livré le</label>
                <p class="mt-1 text-sm text-gray-900">{{ messageHistoryService.formatDate(message.deliveredAt || null) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations sur les erreurs -->
        <div v-if="message.errorMessage" class="mt-6 bg-white border border-red-200 shadow-sm">
          <div class="px-6 py-4 border-b border-red-200">
            <h3 class="text-lg font-medium text-red-900">Erreur</h3>
          </div>
          <div class="p-6">
            <div class="bg-red-50 p-4 rounded-lg">
              <p class="text-sm text-red-800">{{ message.errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Informations liées -->
        <div class="mt-6 bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations liées</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Patient</label>
                <p class="mt-1 text-sm text-gray-900">{{ getPatientName(message.patientUuid) }}</p>
                <p class="mt-1 text-xs text-gray-500 font-mono">{{ message.patientUuid }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">UUID Type de message</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ message.messageTypeUuid }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">UUID Modèle de message</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ message.messageModelUuid }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { messageHistoryService } from '../services/messageHistoryService'
import { patientService } from '../services/patientService'
import type { ExtendedMessageSend } from '../types/global'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const message = ref<ExtendedMessageSend | null>(null)
const loading = ref(false)

// Obtenir le nom du patient
const getPatientName = (patientUuid: string | undefined) => {
  if (!patientUuid) return 'Patient inconnu'
  const patient = patientService.getPatientById(patientUuid)
  return patient ? `${patient.firstname} ${patient.lastname}` : 'Patient inconnu'
}

// Charger le message
const loadMessage = async () => {
  loading.value = true
  try {
    const uuid = route.params.uuid as string
    const messageData = messageHistoryService.getMessageHistoryById(uuid)
    message.value = messageData
  } catch (error) {
    console.error('Erreur lors du chargement du message:', error)
  } finally {
    loading.value = false
  }
}

// Navigation
const goBack = () => {
  router.push('/message-history')
}

// Actions
const resendMessage = () => {
  if (message.value && confirm('Êtes-vous sûr de vouloir relancer ce message ?')) {
    const success = messageHistoryService.resendMessage(message.value.uuid)
    if (success) {
      loadMessage()
      if (window.showNotification) {
        window.showNotification('success', 'Message relancé', 'Le message a été relancé avec succès')
      }
    }
  }
}

const deleteMessage = () => {
  if (message.value && confirm('Êtes-vous sûr de vouloir supprimer cet historique ?')) {
    const success = messageHistoryService.deleteMessageHistory(message.value.uuid)
    if (success) {
      if (window.showNotification) {
        window.showNotification('success', 'Historique supprimé', 'L\'historique a été supprimé avec succès')
      }
      router.push('/message-history')
    }
  }
}

// Initialisation
onMounted(() => {
  loadMessage()
})
</script>
