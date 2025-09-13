<template>
  <Layout :title="$t('users.title')">
    <div class="space-y-6">
      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="openAddUserModal" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="user-plus" class="mr-1 md:mr-2" />
              {{ $t('actions.create') }} {{ $t('users.title').toLowerCase() }}
            </button>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                :placeholder="$t('actions.search') + ' ' + $t('users.title').toLowerCase() + '...'"
                class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
              />
              <font-awesome-icon icon="search" class="absolute left-2 md:left-3 top-2.5 text-gray-400 text-sm" />
            </div>
            <select v-model="selectedProfile" @change="loadUsers" class="px-2 md:px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">{{ $t('profiles.title') }} - {{ $t('actions.all') }}</option>
              <option value="Administrateur">Administrateur</option>
              <option value="Médecin">Médecin</option>
              <option value="Secrétaire">Secrétaire</option>
            </select>
          </div>
        </div>

        <!-- Tableau des utilisateurs avec pagination côté serveur -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('users.title') }}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('forms.email') }}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('users.profile') }}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('forms.phone') }}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('forms.status') }}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('actions.title') }}</th>
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
                  <ActionButtons
                    @view="viewUser(user)"
                    @edit="editUser(user)"
                    @delete="deleteUser(user)"
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
import { userService } from '../services/userService'
import type { User } from '../types/global'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'
import Swal from 'sweetalert2'

const router = useRouter()

// Variables réactives
const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedProfile = ref('')
const searchTimeout = ref<number | null>(null)


// Fonctions de chargement
const loadUsers = async () => {
  loading.value = true
  try {
    // Charger tous les utilisateurs sans pagination
    const allUsers = await userService.getAllUsers()
    
    // Appliquer le filtre de recherche
    let filteredUsers = allUsers
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredUsers = allUsers.filter(user => 
        user.firstname.toLowerCase().includes(query) ||
        user.lastname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    }
    
    // Appliquer le filtre de profil
    if (selectedProfile.value) {
      filteredUsers = filteredUsers.filter(user => user.profil === selectedProfile.value)
    }
    
    users.value = filteredUsers
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les utilisateurs')
    }
  } finally {
    loading.value = false
  }
}



const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
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

const deleteUser = async (user: User) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    text: `Vous allez supprimer l'utilisateur "${user.firstname} ${user.lastname}". Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    const success = userService.deleteUser(user.uuid)
    if (success) {
      await Swal.fire({
        title: 'Supprimé !',
        text: `L'utilisateur ${user.firstname} ${user.lastname} a été supprimé avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      loadUsers() // Recharger la liste
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

const openAddUserModal = () => {
  router.push('/users/create')
}

// Watchers
watch(selectedProfile, () => {
  loadUsers()
})

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

