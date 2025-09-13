<template>
  <Layout title="Modèles de messages">
    <div class="space-y-6">

      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="openAddTemplateModal" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="plus" class="mr-1 md:mr-2" />
              Nouveau modèle
            </button>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher un modèle..."
                class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
              />
              <font-awesome-icon icon="search" class="absolute left-2 md:left-3 top-2.5 text-gray-400 text-sm" />
            </div>
            <select v-model="selectedType" @change="loadTemplates" class="px-2 md:px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tous les types</option>
              <option value="Rappel RDV">Rappel RDV</option>
              <option value="Annulation">Annulation</option>
              <option value="Report">Report</option>
              <option value="Confirmation">Confirmation</option>
              <option value="Personnalisé">Personnalisé</option>
            </select>
          </div>
        </div>

        <!-- Tableau des modèles -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Indicateur de chargement -->
              <tr v-if="loading" class="bg-gray-50">
                <td colspan="4" class="px-4 py-8 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <font-awesome-icon icon="spinner" class="animate-spin text-blue-600" />
                    <span class="text-gray-600">Chargement des modèles...</span>
                  </div>
                </td>
              </tr>
              
              <!-- Message si aucun résultat -->
              <tr v-else-if="!loading && templates.length === 0" class="bg-gray-50">
                <td colspan="4" class="px-4 py-8 text-center">
                  <div class="text-gray-500">
                    <font-awesome-icon icon="inbox" class="text-4xl mb-2" />
                    <p>Aucun modèle trouvé</p>
                    <p class="text-sm">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
              
              <!-- Données des modèles -->
              <tr v-else v-for="template in templates" :key="template.uuid" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <font-awesome-icon icon="comment-dots" class="text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ template.name }}</p>
                      <p class="text-xs text-gray-500">{{ template.uuid.substring(0, 8) }}...</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ template.messageType }}</td>
                <td class="px-4 py-3">
                  <span :class="template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ template.status === 'active' ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <ActionButtons
                    @view="viewTemplate(template)"
                    @edit="editTemplate(template)"
                    @delete="deleteTemplate(template)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import ActionButtons from '../components/ActionButtons.vue'
import { messageTemplateService } from '../services/messageTemplateService'
import type { MessageTemplate } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'
import Swal from 'sweetalert2'

const router = useRouter()

// Variables réactives pour la pagination
const templates = ref<MessageTemplate[]>([])
const pagination = ref<PaginatedResponse<MessageTemplate>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedType = ref('')
const searchTimeout = ref<number | null>(null)
const loading = ref(false)


// Fonctions de pagination
const loadTemplates = async () => {
  loading.value = true
  try {
    const params: PaginationParams = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value || undefined,
      filters: selectedType.value ? { messageType: selectedType.value } : undefined,
      sortBy: 'name',
      sortOrder: 'asc'
    }
    
    const response = messageTemplateService.getTemplatesWithPagination(params)
    templates.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Erreur lors du chargement des modèles:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les modèles de messages')
    }
  } finally {
    loading.value = false
  }
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadTemplates()
}

const onPageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize
  currentPage.value = 1 // Reset à la première page
  loadTemplates()
}

const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset à la première page lors de la recherche
    loadTemplates()
  }, 500)
}

// Fonctions CRUD
const viewTemplate = (template: MessageTemplate) => {
  router.push(`/message-templates/${template.uuid}`)
}

const editTemplate = (template: MessageTemplate) => {
  router.push(`/message-templates/${template.uuid}/edit`)
}

const deleteTemplate = async (template: MessageTemplate) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce modèle ?',
    text: `Vous allez supprimer le modèle "${template.name}". Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    const success = messageTemplateService.deleteMessageTemplate(template.uuid)
    if (success) {
      await Swal.fire({
        title: 'Supprimé !',
        text: `Le modèle ${template.name} a été supprimé avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      loadTemplates() // Recharger la liste
    } else {
      await Swal.fire({
        title: 'Erreur !',
        text: 'Une erreur est survenue lors de la suppression.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }
}

const openAddTemplateModal = () => {
  // Vérifier qu'on n'est pas sur une page complémentaire
  if (currentPage.value !== 1) {
    currentPage.value = 1
    loadTemplates()
  }
  router.push('/message-templates/create')
}

// Watchers
watch(selectedType, () => {
  currentPage.value = 1
  loadTemplates()
})

// Lifecycle
onMounted(() => {
  loadTemplates()
})
</script>
