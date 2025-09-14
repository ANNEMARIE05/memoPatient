<template>
  <Layout title="Gestion des profils">
    <div class="space-y-6">

      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="openAddProfileModal" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="plus" class="mr-1 md:mr-2" />
              Nouveau profil
            </button>
            <button @click="importExcel" class="bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="file-excel" class="mr-1 md:mr-2" />
              Importer Excel
            </button>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher un profil..."
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

        <!-- Tableau des profils -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du profil</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateurs</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="profile in profiles" :key="profile.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <font-awesome-icon icon="user-shield" class="text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ profile.name }}</p>
                      <p class="text-xs text-gray-500">ID: {{ profile.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ profile.description }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="permission in profile.permissions.slice(0, 3)" :key="permission" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ permission }}
                    </span>
                    <span v-if="profile.permissions.length > 3" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{{ profile.permissions.length - 3 }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ profile.userCount }} utilisateurs</td>
                <td class="px-4 py-3">
                  <span :class="profile.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ profile.active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <button @click="viewProfile(profile)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                      <font-awesome-icon icon="eye" />
                    </button>
                    <button @click="editProfile(profile)" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                      <font-awesome-icon icon="edit" />
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
import { profileService } from '../services/profileService.js'
import type { Profile } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'

const router = useRouter()

// Variables réactives pour la pagination
const profiles = ref<Profile[]>([])
const pagination = ref<PaginatedResponse<Profile>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const searchTimeout = ref<number | null>(null)
const loading = ref(false)



// Fonctions de pagination
const loadProfiles = () => {
  const params: PaginationParams = {
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  }
  
  const response = profileService.getProfiles(params)
  profiles.value = response.data
  pagination.value = response.pagination
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadProfiles()
}

const onPageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize
  currentPage.value = 1 // Reset à la première page
  loadProfiles()
}

const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset à la première page lors de la recherche
    loadProfiles()
  }, 500)
}

// Fonctions CRUD
const viewProfile = (profile: Profile) => {
  router.push(`/profiles/${profile.id}`)
}

const editProfile = (profile: Profile) => {
  router.push(`/profiles/${profile.id}/edit`)
}


const openAddProfileModal = () => {
  // Vérifier qu'on n'est pas sur une page complémentaire
  if (currentPage.value !== 1) {
    currentPage.value = 1
    loadProfiles()
  }
  router.push('/profiles/create')
}

const importExcel = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Import Excel', 'Fonctionnalité d\'import Excel à implémenter')
  }
}

// Lifecycle
onMounted(() => {
  loadProfiles()
})
</script>

