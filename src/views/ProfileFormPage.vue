<template>
  <Layout :title="isEdit ? 'Modifier un profil' : 'Créer un profil'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/profiles" class="hover:text-blue-600">Profils</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">{{ isEdit ? 'Modifier' : 'Créer' }}</span>
        </nav>
      </div>

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier le profil' : 'Nouveau profil' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Informations du profil -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom du profil <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Administrateur, Médecin, Secrétaire"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Code du profil <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: ADMIN, MEDECIN, SECRET"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description du profil et de ses permissions"
            ></textarea>
          </div>

          <!-- Permissions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-4">
              Permissions
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="permission in availablePermissions" :key="permission.key" class="flex items-center">
                <input
                  :id="permission.key"
                  v-model="form.permissions"
                  :value="permission.key"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label :for="permission.key" class="ml-2 text-sm text-gray-700">
                  {{ permission.label }}
                </label>
              </div>
            </div>
          </div>

          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Statut <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez le statut</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link
              to="/profiles"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
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
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  status: 'active'
})

// Permissions disponibles
const availablePermissions = [
  { key: 'users.read', label: 'Voir les utilisateurs' },
  { key: 'users.create', label: 'Créer des utilisateurs' },
  { key: 'users.edit', label: 'Modifier les utilisateurs' },
  { key: 'users.delete', label: 'Supprimer les utilisateurs' },
  { key: 'patients.read', label: 'Voir les patients' },
  { key: 'patients.create', label: 'Créer des patients' },
  { key: 'patients.edit', label: 'Modifier les patients' },
  { key: 'patients.delete', label: 'Supprimer les patients' },
  { key: 'appointments.read', label: 'Voir les rendez-vous' },
  { key: 'appointments.create', label: 'Créer des rendez-vous' },
  { key: 'appointments.edit', label: 'Modifier les rendez-vous' },
  { key: 'appointments.delete', label: 'Supprimer les rendez-vous' },
  { key: 'medical_records.read', label: 'Voir les dossiers médicaux' },
  { key: 'medical_records.create', label: 'Créer des dossiers médicaux' },
  { key: 'medical_records.edit', label: 'Modifier les dossiers médicaux' },
  { key: 'medical_records.delete', label: 'Supprimer les dossiers médicaux' },
  { key: 'messages.read', label: 'Voir les messages' },
  { key: 'messages.send', label: 'Envoyer des messages' },
  { key: 'templates.read', label: 'Voir les modèles' },
  { key: 'templates.create', label: 'Créer des modèles' },
  { key: 'templates.edit', label: 'Modifier les modèles' },
  { key: 'templates.delete', label: 'Supprimer les modèles' },
  { key: 'dashboard.read', label: 'Accéder au tableau de bord' },
  { key: 'reports.read', label: 'Voir les rapports' }
]

// Charger les données du profil en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.id) {
    const profile = profileService.getProfileById(route.params.id as string)
    if (profile) {
      form.value = {
        name: profile.name,
        code: profile.code,
        description: profile.description || '',
        permissions: profile.permissions || [],
        status: profile.status || 'active'
      }
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isEdit.value && route.params.id) {
      // Mode édition
      const updatedProfile = profileService.updateProfile(route.params.id as string, {
        name: form.value.name,
        code: form.value.code,
        description: form.value.description,
        permissions: form.value.permissions,
        status: form.value.status
      })
      
      if (updatedProfile) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Profil mis à jour avec succès')
        }
        router.push('/profiles')
      }
    } else {
      // Mode création
      const newProfile = profileService.addProfile({
        name: form.value.name,
        code: form.value.code,
        description: form.value.description,
        permissions: form.value.permissions,
        status: form.value.status
      })
      
      if (newProfile) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Profil créé avec succès')
        }
        router.push('/profiles')
      }
    }
  } catch (error) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement')
    }
  } finally {
    loading.value = false
  }
}
</script>
