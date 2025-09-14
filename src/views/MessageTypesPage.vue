<template>
  <Layout title="Types de messages">
    <div class="space-y-6">
      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <router-link to="/message-types/create" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors inline-flex items-center">
              <font-awesome-icon icon="plus" class="mr-1 md:mr-2" />
              Nouveau type
            </router-link>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher un type..."
                class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
              />
              <font-awesome-icon icon="search" class="absolute left-2 md:left-3 top-2.5 text-gray-400 text-sm" />
            </div>
          </div>
        </div>

        <!-- Sélecteur de taille de page -->
        <div class="flex justify-end px-6 py-3 border-b border-gray-100">
          <div class="flex items-center space-x-2">
            <label for="pageSize" class="text-sm text-gray-600">Afficher</label>
            <select
              id="pageSize"
              :value="pageSize"
              @change="(event) => onPageSizeChange(parseInt((event.target as HTMLSelectElement).value))"
              :disabled="loading"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-600">éléments</span>
          </div>
        </div>

        <!-- Tableau des types -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Indicateur de chargement -->
              <tr v-if="loading" class="bg-gray-50">
                <td colspan="3" class="px-4 py-8 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <font-awesome-icon icon="spinner" class="animate-spin text-blue-600" />
                    <span class="text-gray-600">Chargement des types...</span>
                  </div>
                </td>
              </tr>
              
              <!-- Message si aucun résultat -->
              <tr v-else-if="!loading && messageTypes.length === 0" class="bg-gray-50">
                <td colspan="3" class="px-4 py-8 text-center">
                  <div class="text-gray-500">
                    <font-awesome-icon icon="inbox" class="text-4xl mb-2" />
                    <p>Aucun type trouvé</p>
                    <p class="text-sm">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
              
              <!-- Données des types -->
              <tr v-else v-for="messageType in messageTypes" :key="messageType.uuid" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <font-awesome-icon icon="tags" class="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ messageType.libelle }}</p>
                      <p class="text-xs text-gray-500">{{ messageType.uuid.substring(0, 8) }}...</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Actif
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <router-link :to="`/message-types/${messageType.uuid}/edit`" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                      <font-awesome-icon icon="edit" />
                    </router-link>
                    <button @click="deleteType(messageType)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <PaginationComponent
          v-if="pagination"
          :pagination="pagination"
          :loading="loading"
          @page-change="onPageChange"
          @page-size-change="onPageSizeChange"
        />

      </div>
    </div>

  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import PaginationComponent from '../components/PaginationComponent.vue'
import { messageTypeService } from '../services/messageTypeService'
import type { MessageType } from '../types/global'
import { ref, onMounted } from 'vue'
import type { PaginationParams, PaginatedResponse } from '../types/global'

// Variables réactives pour la pagination
const messageTypes = ref<MessageType[]>([])
const pagination = ref<PaginatedResponse<MessageType>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const searchTimeout = ref<number | null>(null)
const loading = ref(false)


// Fonctions de pagination
const loadMessageTypes = async () => {
  loading.value = true
  try {
    const params: PaginationParams = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value || undefined,
      sortBy: 'libelle',
      sortOrder: 'asc'
    }
    
    const response = messageTypeService.getMessageTypesWithPagination(params)
    messageTypes.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Erreur lors du chargement des types:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les types de messages')
    }
  } finally {
    loading.value = false
  }
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadMessageTypes()
}

const onPageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize
  currentPage.value = 1 // Reset à la première page
  loadMessageTypes()
}

const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset à la première page lors de la recherche
    loadMessageTypes()
  }, 500)
}

// Fonctions CRUD

const deleteType = async (messageType: MessageType) => {
  const success = messageTypeService.deleteMessageType(messageType.uuid)
  if (success) {
    if (window.showNotification) {
      window.showNotification('success', 'Supprimé', `Le type ${messageType.libelle} a été supprimé avec succès.`)
    }
    loadMessageTypes() // Recharger la liste
  } else {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de la suppression.')
    }
  }
}


// Lifecycle
onMounted(() => {
  loadMessageTypes()
})
</script>
