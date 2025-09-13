<template>
  <Layout title="Détails de l'utilisateur">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- En-tête avec actions -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ user?.firstname }} {{ user?.lastname }}
              </h2>
              <p class="text-sm text-gray-500">{{ user?.profil }}</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                :to="`/users/${user?.uuid}/edit`"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <font-awesome-icon icon="edit" class="mr-2" />
                Modifier
              </router-link>
              <button
                @click="handleDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <font-awesome-icon icon="trash" class="mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations de l'utilisateur -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations personnelles -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Prénom</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.firstname }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Nom</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.lastname }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Genre</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.genre }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Téléphone principal</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.phone1 }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Téléphone secondaire</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.phone2 || 'Non renseigné' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations système -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations système</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">ID Utilisateur</label>
              <p class="mt-1 text-sm text-gray-900 font-mono">{{ user?.uuid }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Profil</label>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ user?.profil }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Date de création</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(user?.created_at) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Dernière modification</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(user?.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div 
        class="bg-white p-6 max-w-sm w-full mx-4 shadow-2xl rounded-2xl border border-gray-100"
        @click.stop
      >
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mr-4">
            <font-awesome-icon icon="exclamation-triangle" class="text-red-600 text-2xl" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            <p class="text-sm text-gray-600 mt-1">Cette action est irréversible</p>
          </div>
        </div>
        
        <div class="flex justify-between space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 rounded-xl font-medium shadow-md"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { userService } from '../services/userService'
import type { User } from '../types/global'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const showDeleteModal = ref(false)

const user = ref<User | undefined>()

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Utilisateurs', path: '/users' },
  { label: 'Détails', path: '' }
])

// Charger les données de l'utilisateur
onMounted(() => {
  if (route.params.uuid) {
    user.value = userService.getUserById(route.params.uuid as string)
    if (!user.value) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Utilisateur non trouvé')
      }
      router.push('/users')
    }
  }
})

// Formater une date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Gestionnaire de suppression
const handleDelete = () => {
  showDeleteModal.value = true
}

// Confirmer la suppression
const confirmDelete = () => {
  if (user.value?.uuid) {
    const success = userService.deleteUser(user.value.uuid)
    if (success) {
      if (window.showNotification) {
        window.showNotification('success', 'Succès', 'Utilisateur supprimé avec succès')
      }
      router.push('/users')
    } else {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Erreur lors de la suppression')
      }
    }
  }
  showDeleteModal.value = false
}
</script>
