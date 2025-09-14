<template>
  <Layout title="Détails de l'utilisateur">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- En-tête -->
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
                to="/users"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <font-awesome-icon icon="arrow-left" class="mr-2" />
                Retour à la liste
              </router-link>
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

  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { userService } from '../services/userService'
import type { User } from '../types/global'

const route = useRoute()
const router = useRouter()

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

</script>
