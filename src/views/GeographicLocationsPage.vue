<template>
  <Layout title="Localisation">
    <div class="space-y-6">
      <!-- Actions principales -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <h2 class="text-lg font-semibold text-gray-900">Lieux d'habitation</h2>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="addNewLocation" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="plus" class="mr-2" />
              Ajouter un lieu
            </button>
            <button @click="exportLocations" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="download" class="mr-2" />
              Exporter
            </button>
          </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nom du lieu ou code postal..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @input="handleSearch"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              v-model="selectedType"
              @change="handleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tous les types</option>
              <option value="country">Pays</option>
              <option value="region">Région</option>
              <option value="city">Ville</option>
              <option value="district">Arrondissement/Quartier</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              v-model="selectedStatus"
              @change="handleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tous</option>
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
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

        <!-- Liste des lieux -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Postal</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Indicateur de chargement -->
              <tr v-if="loading" class="bg-gray-50">
                <td colspan="6" class="px-4 py-8 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <font-awesome-icon icon="spinner" class="animate-spin text-blue-600" />
                    <span class="text-gray-600">Chargement des lieux...</span>
                  </div>
                </td>
              </tr>
              
              <!-- Message si aucun résultat -->
              <tr v-else-if="!loading && locations.length === 0" class="bg-gray-50">
                <td colspan="6" class="px-4 py-8 text-center">
                  <div class="text-gray-500">
                    <font-awesome-icon icon="map-marker-alt" class="text-4xl mb-2" />
                    <p>Aucun lieu trouvé</p>
                    <p class="text-sm">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
              
              <!-- Données des lieux -->
              <tr v-else v-for="location in locations" :key="location.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <font-awesome-icon :icon="getLocationIcon(location.type)" class="text-blue-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ location.name }}</p>
                      <p class="text-xs text-gray-500">{{ location.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="getTypeClass(location.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getTypeText(location.type) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 font-mono">
                  {{ location.postalCode || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ getParentName(location.parentId) || '-' }}
                </td>
                <td class="px-4 py-3">
                  <span :class="location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ location.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <ActionButtons
                    @view="viewLocation(location)"
                    @edit="editLocation(location)"
                    @delete="deleteLocation(location)"
                  />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import PaginationComponent from '../components/PaginationComponent.vue'
import ActionButtons from '../components/ActionButtons.vue'
import { geographicLocationService } from '../services/geographicLocationService'
import type { GeographicLocation } from '../services/geographicLocationService'
import type { PaginationParams, PaginatedResponse } from '../types/global'
import Swal from 'sweetalert2'

const router = useRouter()

// Variables réactives
const locations = ref<GeographicLocation[]>([])
const pagination = ref<PaginatedResponse<GeographicLocation>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const searchTimeout = ref<number | null>(null)


// Fonctions utilitaires
const getLocationIcon = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'globe'
    case 'region': return 'map'
    case 'city': return 'city'
    case 'district': return 'building'
    default: return 'map-marker-alt'
  }
}

const getTypeClass = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'bg-blue-100 text-blue-800'
    case 'region': return 'bg-green-100 text-green-800'
    case 'city': return 'bg-purple-100 text-purple-800'
    case 'district': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'Pays'
    case 'region': return 'Région'
    case 'city': return 'Ville'
    case 'district': return 'Arrondissement'
    default: return 'Autre'
  }
}

const getParentName = (parentId?: string): string => {
  if (!parentId) return ''
  const parent = geographicLocationService.getLocationById(parentId)
  return parent?.name || ''
}

// Fonctions de pagination
const onPageChange = (page: number) => {
  currentPage.value = page
  loadLocations()
}

const onPageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize
  currentPage.value = 1 // Reset à la première page
  loadLocations()
}

// Fonctions de filtrage
const handleSearch = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset à la première page lors de la recherche
    loadLocations()
  }, 500)
}

const handleFilter = () => {
  currentPage.value = 1
  loadLocations()
}

// Fonctions d'action
const addNewLocation = () => {
  router.push('/geographic-locations/create')
}

const exportLocations = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Export', 'Export des lieux en cours...')
  }
}

const viewLocation = (location: GeographicLocation) => {
  router.push(`/geographic-locations/${location.id}`)
}

const editLocation = (location: GeographicLocation) => {
  router.push(`/geographic-locations/${location.id}/edit`)
}

const deleteLocation = async (location: GeographicLocation) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce lieu ?',
    text: `Vous allez supprimer "${location.name}". Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    try {
      const success = geographicLocationService.deleteLocation(location.id)
      if (success) {
        await Swal.fire({
          title: 'Supprimé !',
          text: `${location.name} a été supprimé avec succès.`,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        loadLocations() // Recharger la liste
      } else {
        await Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de la suppression.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    } catch (error: any) {
      await Swal.fire({
        title: 'Erreur !',
        text: error.message || 'Une erreur est survenue lors de la suppression.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }
}

// Chargement des données
const loadLocations = async () => {
  loading.value = true
  try {
    const filters: any = {}
    
    if (selectedType.value) {
      filters.type = selectedType.value
    }
    
    if (selectedStatus.value !== '') {
      filters.isActive = selectedStatus.value === 'true'
    }

    const params: PaginationParams = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value || undefined,
      filters,
      sortBy: 'name',
      sortOrder: 'asc'
    }

    const response = geographicLocationService.getLocations(params)
    locations.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Erreur lors du chargement des lieux:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les lieux')
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadLocations()
})
</script>
