<template>
  <Layout title="Historiques des messages">
    <div class="space-y-6">
      <!-- En-tête avec bouton d'ajout -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Historiques des messages</h1>
          <p class="text-gray-600 mt-1">Consultez l'historique des messages envoyés</p>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="envelope" class="text-blue-600 text-sm" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-xl font-bold text-gray-900">{{ messageHistoryStats.totalMessages }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="check-circle" class="text-green-600 text-sm" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Livrés aujourd'hui</p>
              <p class="text-xl font-bold text-gray-900">{{ messageHistoryStats.deliveredToday }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="clock" class="text-yellow-600 text-sm" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">En attente</p>
              <p class="text-xl font-bold text-gray-900">{{ messageHistoryStats.pendingToday }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="times-circle" class="text-red-600 text-sm" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Échecs</p>
              <p class="text-xl font-bold text-gray-900">{{ messageHistoryStats.failedToday }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="paper-plane" class="text-purple-600 text-sm" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Envoyés aujourd'hui</p>
              <p class="text-xl font-bold text-gray-900">{{ messageHistoryStats.sentToday }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Recherche -->
          <div class="flex-1">
            <div class="relative">
              <font-awesome-icon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher par contenu, numéro ou UUID..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Filtres -->
          <div class="flex gap-4">
            <select v-model="statusFilter" @change="loadMessageHistory" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tous les statuts</option>
              <option value="delivered">Livré</option>
              <option value="pending">En attente</option>
              <option value="failed">Échec</option>
            </select>

            <select v-model="deliveryStatusFilter" @change="loadMessageHistory" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tous les états</option>
              <option value="success">Succès</option>
              <option value="pending">En attente</option>
              <option value="failed">Échec</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table des historiques -->
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th 
                  v-for="column in columns" 
                  :key="column.key"
                  @click="sortBy(column.key)"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    {{ column.label }}
                    <font-awesome-icon 
                      v-if="sortField === column.key"
                      :icon="sortOrder === 'asc' ? 'sort-up' : 'sort-down'"
                      class="text-gray-400 text-xs"
                    />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="animate-pulse">
                <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-gray-500">
                  Chargement...
                </td>
              </tr>
              <tr v-else-if="messageHistory.length === 0">
                <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-gray-500">
                  Aucun historique de message trouvé
                </td>
              </tr>
              <tr v-else v-for="message in messageHistory" :key="message.uuid" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ message.uuid }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {{ message.content }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ message.phoneNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    messageHistoryService.getStatusClass(message.status)
                  ]">
                    {{ messageHistoryService.getStatusText(message.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ messageHistoryService.formatDate(message.sentAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ messageHistoryService.formatDate(message.deliveredAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ message.errorMessage || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewMessage(message)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Voir les détails"
                    >
                      <font-awesome-icon icon="eye" class="text-sm" />
                    </button>
                    <button
                      v-if="message.status === 'failed'"
                      @click="resendMessage(message.uuid)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Relancer le message"
                    >
                      <font-awesome-icon icon="redo" class="text-sm" />
                    </button>
                    <button
                      @click="deleteMessage(message.uuid)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Supprimer"
                    >
                      <font-awesome-icon icon="trash" class="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <PaginationComponent
          v-if="pagination && pagination.totalPages > 1"
          :pagination="pagination"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import PaginationComponent from '../components/PaginationComponent.vue'
import { messageHistoryService } from '../services/messageHistoryService'
import type { MessageSend, MessageHistoryStats, PaginationParams } from '../types/global'

const router = useRouter()

// État réactif
const messageHistory = ref<MessageSend[]>([])
const messageHistoryStats = ref<MessageHistoryStats>({
  totalMessages: 0,
  sentToday: 0,
  deliveredToday: 0,
  failedToday: 0,
  pendingToday: 0
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const deliveryStatusFilter = ref('')
const sortField = ref('sentAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const searchTimeout = ref<number | null>(null)

// Configuration des colonnes du tableau
const columns = [
  { key: 'uuid', label: 'UUID' },
  { key: 'content', label: 'Contenu' },
  { key: 'phoneNumber', label: 'Numéro' },
  { key: 'status', label: 'Statut' },
  { key: 'sentAt', label: 'Envoyé le' },
  { key: 'deliveredAt', label: 'Livré le' },
  { key: 'errorMessage', label: 'Erreur' }
]

// Charger les historiques de messages
const loadMessageHistory = async () => {
  loading.value = true
  try {
    const params: PaginationParams = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: searchQuery.value || undefined,
      sortBy: sortField.value,
      sortOrder: sortOrder.value,
      filters: {
        status: statusFilter.value || undefined,
        deliveryStatus: deliveryStatusFilter.value || undefined
      }
    }

    const response = messageHistoryService.getMessageHistory(params)
    messageHistory.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Erreur lors du chargement des historiques:', error)
  } finally {
    loading.value = false
  }
}

// Charger les statistiques
const loadStats = () => {
  messageHistoryStats.value = messageHistoryService.getMessageHistoryStats()
}

// Gestion de la recherche avec debounce
const onSearchChange = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = window.setTimeout(() => {
    pagination.value.page = 1
    loadMessageHistory()
  }, 500)
}

// Changement de page
const onPageChange = (page: number) => {
  pagination.value.page = page
  loadMessageHistory()
}

// Tri
const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  loadMessageHistory()
}

// Actions
const viewMessage = (message: MessageSend) => {
  router.push(`/message-history/${message.uuid}`)
}

const resendMessage = (uuid: string) => {
  if (confirm('Êtes-vous sûr de vouloir relancer ce message ?')) {
    const success = messageHistoryService.resendMessage(uuid)
    if (success) {
      loadMessageHistory()
      loadStats()
      // Notification de succès
      if (window.showNotification) {
        window.showNotification('success', 'Message relancé', 'Le message a été relancé avec succès')
      }
    }
  }
}

const deleteMessage = (uuid: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet historique ?')) {
    const success = messageHistoryService.deleteMessageHistory(uuid)
    if (success) {
      loadMessageHistory()
      loadStats()
      // Notification de succès
      if (window.showNotification) {
        window.showNotification('success', 'Historique supprimé', 'L\'historique a été supprimé avec succès')
      }
    }
  }
}

// Initialisation
onMounted(() => {
  loadMessageHistory()
  loadStats()
})
</script>
