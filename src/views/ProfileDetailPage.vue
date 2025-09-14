<template>
  <Layout title="Détails du profil">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/profiles" class="hover:text-blue-600">Profils</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">Détails</span>
        </nav>
      </div>

      <!-- En-tête -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ profile?.name }}
              </h2>
              <p class="text-sm text-gray-500">{{ profile?.code }}</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                to="/profiles"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <font-awesome-icon icon="arrow-left" class="mr-2" />
                Retour à la liste
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du profil -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations générales</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Nom du profil</label>
              <p class="mt-1 text-sm text-gray-900">{{ profile?.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Code du profil</label>
              <p class="mt-1 text-sm text-gray-900 font-mono">{{ profile?.code }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Description</label>
              <p class="mt-1 text-sm text-gray-900">{{ profile?.description || 'Aucune description' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Statut</label>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                profile?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]">
                {{ profile?.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Permissions</h3>
          </div>
          <div class="p-6">
            <div v-if="profile?.permissions && profile.permissions.length > 0" class="space-y-2">
              <div v-for="permission in groupedPermissions" :key="permission.category" class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">{{ permission.category }}</h4>
                <div class="grid grid-cols-1 gap-1">
                  <div v-for="perm in permission.permissions" :key="perm" class="flex items-center text-sm text-gray-600">
                    <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                    {{ getPermissionLabel(perm) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">
              Aucune permission définie
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
import { profileService } from '../services/profileService'
import type { Profile } from '../types/global'

const route = useRoute()
const router = useRouter()

const profile = ref<Profile | undefined>()

// Charger les données du profil
onMounted(() => {
  if (route.params.id) {
    profile.value = profileService.getProfileById(route.params.id as string)
    if (!profile.value) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Profil non trouvé')
      }
      router.push('/profiles')
    }
  }
})

// Grouper les permissions par catégorie
const groupedPermissions = computed(() => {
  if (!profile.value?.permissions) return []
  
  const groups: Record<string, string[]> = {}
  
  profile.value.permissions.forEach((permission: string) => {
    const [category] = permission.split('.')
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(permission)
  })
  
  return Object.entries(groups).map(([category, permissions]) => ({
    category: getCategoryLabel(category),
    permissions
  }))
})

// Obtenir le label d'une permission
const getPermissionLabel = (permission: string): string => {
  const permissionLabels: Record<string, string> = {
    'users.read': 'Voir les utilisateurs',
    'users.create': 'Créer des utilisateurs',
    'users.edit': 'Modifier les utilisateurs',
    'users.delete': 'Supprimer les utilisateurs',
    'patients.read': 'Voir les patients',
    'patients.create': 'Créer des patients',
    'patients.edit': 'Modifier les patients',
    'patients.delete': 'Supprimer les patients',
    'appointments.read': 'Voir les rendez-vous',
    'appointments.create': 'Créer des rendez-vous',
    'appointments.edit': 'Modifier les rendez-vous',
    'appointments.delete': 'Supprimer les rendez-vous',
    'medical_records.read': 'Voir les dossiers médicaux',
    'medical_records.create': 'Créer des dossiers médicaux',
    'medical_records.edit': 'Modifier les dossiers médicaux',
    'medical_records.delete': 'Supprimer les dossiers médicaux',
    'messages.read': 'Voir les messages',
    'messages.send': 'Envoyer des messages',
    'templates.read': 'Voir les modèles',
    'templates.create': 'Créer des modèles',
    'templates.edit': 'Modifier les modèles',
    'templates.delete': 'Supprimer les modèles',
    'dashboard.read': 'Accéder au tableau de bord',
    'reports.read': 'Voir les rapports'
  }
  
  return permissionLabels[permission] || permission
}

// Obtenir le label d'une catégorie
const getCategoryLabel = (category: string): string => {
  const categoryLabels: Record<string, string> = {
    'users': 'Gestion des utilisateurs',
    'patients': 'Gestion des patients',
    'appointments': 'Gestion des rendez-vous',
    'medical_records': 'Gestion des dossiers médicaux',
    'messages': 'Gestion des messages',
    'templates': 'Gestion des modèles',
    'dashboard': 'Tableau de bord',
    'reports': 'Rapports'
  }
  
  return categoryLabels[category] || category
}


</script>
