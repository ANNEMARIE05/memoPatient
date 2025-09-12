<template>
  <Layout title="Modèles de messages">
    <div class="space-y-6">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total modèles"
          :value="templateStats.total.toString()"
          icon="comment-dots"
          icon-color="blue"
        />
        <MetricCard
          title="Modèles actifs"
          :value="templateStats.active.toString()"
          icon="check-circle"
          icon-color="green"
        />
        <MetricCard
          title="Rendez-vous"
          :value="templateStats.appointments.toString()"
          icon="calendar"
          icon-color="purple"
        />
        <MetricCard
          title="Rappels"
          :value="templateStats.reminders.toString()"
          icon="bell"
          icon-color="orange"
        />
      </div>

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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenu</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variables</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="template in templates" :key="template.uuid" class="hover:bg-gray-50">
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
                <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{{ template.content }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Variables disponibles
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ template.status === 'active' ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <button @click="viewTemplate(template)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                      <font-awesome-icon icon="eye" />
                    </button>
                    <button @click="editTemplate(template)" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button @click="deleteTemplate(template)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
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
          v-if="pagination && pagination.totalPages > 1"
          :pagination="pagination"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import MetricCard from '../components/MetricCard.vue'
import PaginationComponent from '../components/PaginationComponent.vue'
import { messageTemplateService } from '../services/messageTemplateService'
import type { MessageTemplate, MessageTemplateStats } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'

const router = useRouter()

// Variables réactives pour la pagination
const templates = ref<MessageTemplate[]>([])
const pagination = ref<PaginatedResponse<MessageTemplate>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedType = ref('')
const searchTimeout = ref<number | null>(null)

// Statistiques
const templateStats = computed(() => messageTemplateService.getTemplateStats())

// Fonctions de pagination
const loadTemplates = () => {
  const params: PaginationParams = {
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    filters: selectedType.value ? { type: selectedType.value } : undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  }
  
  const response = messageTemplateService.getTemplatesWithPagination(params)
  templates.value = response.data
  pagination.value = response.pagination
}

const onPageChange = (page: number) => {
  currentPage.value = page
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

const deleteTemplate = (template: MessageTemplate) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le modèle ${template.name} ?`)) {
    const success = messageTemplateService.deleteMessageTemplate(template.uuid)
    if (success && window.showNotification) {
      window.showNotification('success', 'Modèle supprimé', `${template.name} a été supprimé avec succès`)
      loadTemplates() // Recharger la liste
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
