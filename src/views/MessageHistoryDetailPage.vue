<template>
  <Layout title="Détail de l'historique">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- En-tête avec navigation -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <font-awesome-icon icon="arrow-left" class="mr-2" />
            Retour
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Détail du message</h1>
            <p class="text-gray-600">{{ message?.uuid }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            v-if="message?.status === 'failed'"
            @click="resendMessage"
            class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <font-awesome-icon icon="redo" class="mr-2" />
            Relancer
          </button>
          <button
            @click="deleteMessage"
            class="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <font-awesome-icon icon="trash" class="mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="!message" class="text-center py-8">
        <font-awesome-icon icon="exclamation-triangle" class="text-gray-400 text-4xl mb-4" />
        <p class="text-gray-500">Message non trouvé</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">UUID</label>
              <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ message.uuid }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                messageHistoryService.getStatusClass(message.status)
              ]">
                {{ messageHistoryService.getStatusText(message.status) }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut de livraison</label>
              <p class="text-sm text-gray-900">{{ message.deliveryStatus }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <p class="text-sm text-gray-900">{{ message.phoneNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Contenu du message -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contenu du message</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-900 whitespace-pre-wrap">{{ message.content }}</p>
          </div>
        </div>

        <!-- Informations de timing -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Horodatage</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Créé le</label>
              <p class="text-sm text-gray-900">{{ messageHistoryService.formatDate(message.createdAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Modifié le</label>
              <p class="text-sm text-gray-900">{{ messageHistoryService.formatDate(message.updatedAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Envoyé le</label>
              <p class="text-sm text-gray-900">{{ messageHistoryService.formatDate(message.sentAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Livré le</label>
              <p class="text-sm text-gray-900">{{ messageHistoryService.formatDate(message.deliveredAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Informations sur les erreurs -->
        <div v-if="message.errorMessage" class="bg-white border border-red-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-red-900 mb-4">Erreur</h2>
          <div class="bg-red-50 p-4 rounded-lg">
            <p class="text-red-800">{{ message.errorMessage }}</p>
          </div>
        </div>

        <!-- Informations liées -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations liées</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">UUID Patient</label>
              <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ message.patientUuid }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">UUID Type de message</label>
              <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ message.messageTypeUuid }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">UUID Modèle de message</label>
              <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ message.messageModelUuid }}</p>
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
import type { MessageSend } from '../types/global'

const route = useRoute()
const router = useRouter()

const message = ref<MessageSend | null>(null)
const loading = ref(false)

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
