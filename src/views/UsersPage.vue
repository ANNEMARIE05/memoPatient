<template>
  <Layout title="Gestion des utilisateurs">
    <div class="space-y-6">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total utilisateurs"
          :value="userStats.total.toString()"
          icon="users"
          icon-color="blue"
        />
        <MetricCard
          title="Utilisateurs actifs"
          :value="userStats.active.toString()"
          icon="user-check"
          icon-color="green"
        />
        <MetricCard
          title="Administrateurs"
          :value="userStats.admins.toString()"
          icon="user-shield"
          icon-color="purple"
        />
        <MetricCard
          title="Nouveaux ce mois"
          :value="userStats.newThisMonth.toString()"
          icon="user-plus"
          icon-color="orange"
        />
      </div>

      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="openAddUserModal" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="user-plus" class="mr-1 md:mr-2" />
              Nouvel utilisateur
            </button>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher un utilisateur..."
                class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
              />
              <font-awesome-icon icon="search" class="absolute left-2 md:left-3 top-2.5 text-gray-400 text-sm" />
            </div>
            <select v-model="selectedProfile" @change="loadUsers" class="px-2 md:px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tous les profils</option>
              <option value="Administrateur">Administrateur</option>
              <option value="Médecin">Médecin</option>
              <option value="Secrétaire">Secrétaire</option>
            </select>
          </div>
        </div>

        <!-- Tableau des utilisateurs -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profil</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.uuid" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <font-awesome-icon icon="user" class="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ user.firstname }} {{ user.lastname }}</p>
                      <p class="text-xs text-gray-500">{{ user.uuid.substring(0, 8) }}...</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ user.profil }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ user.phone1 }}</td>
                <td class="px-4 py-3">
                  <span class="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                    Actif
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                      <font-awesome-icon icon="eye" />
                    </button>
                    <button @click="editUser(user)" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button @click="deleteUser(user)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
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
import { userService } from '../services/userService'
import type { User, UserStats } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'

const router = useRouter()

// Variables réactives pour la pagination
const users = ref<User[]>([])
const pagination = ref<PaginatedResponse<User>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedProfile = ref('')
const searchTimeout = ref<number | null>(null)

// Statistiques
const userStats = computed(() => userService.getUsersStats())

// Fonctions de pagination
const loadUsers = () => {
  const params: PaginationParams = {
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    filters: selectedProfile.value ? { profil: selectedProfile.value } : undefined,
    sortBy: 'firstname',
    sortOrder: 'asc'
  }
  
  const response = userService.getUsers(params)
  users.value = response.data
  pagination.value = response.pagination
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadUsers()
}

const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset à la première page lors de la recherche
    loadUsers()
  }, 500)
}

// Fonctions CRUD
const viewUser = (user: User) => {
  router.push(`/users/${user.uuid}`)
}

const editUser = (user: User) => {
  router.push(`/users/${user.uuid}/edit`)
}

const deleteUser = (user: User) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstname} ${user.lastname} ?`)) {
    const success = userService.deleteUser(user.uuid)
    if (success && window.showNotification) {
      window.showNotification('success', 'Utilisateur supprimé', `${user.firstname} ${user.lastname} a été supprimé avec succès`)
      loadUsers() // Recharger la liste
    }
  }
}

const openAddUserModal = () => {
  // Vérifier qu'on n'est pas sur une page complémentaire
  if (currentPage.value !== 1) {
    currentPage.value = 1
    loadUsers()
  }
  router.push('/users/create')
}

// Watchers
watch(selectedProfile, () => {
  currentPage.value = 1
  loadUsers()
})

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
