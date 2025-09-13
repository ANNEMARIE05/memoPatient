<template>
  <Layout :title="isEdit ? 'Modifier un profil' : 'Créer un profil'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-4 py-3 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier le profil' : 'Nouveau profil' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
          <!-- Informations du profil -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom du profil <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ex: Administrateur, Médecin, Secrétaire"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Code du profil <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ex: ADMIN, MEDECIN, SECRET"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Statut <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Sélectionnez le statut</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Description du profil et de ses permissions"
            ></textarea>
          </div>

          <!-- Permissions -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-medium text-gray-700">
                Permissions
              </label>
              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="downloadTemplate"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <font-awesome-icon icon="download" class="mr-1" />
                  Télécharger le modèle
                </button>
              </div>
            </div>
            
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div class="text-center">
                <font-awesome-icon icon="file-excel" class="text-4xl text-green-600 mb-2" />
                <p class="text-sm text-gray-600 mb-4">
                  Glissez-déposez votre fichier Excel ici ou cliquez pour sélectionner
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".xlsx,.xls"
                  @change="handleFileUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="fileInput?.click()"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Sélectionner un fichier
                </button>
              </div>
            </div>
            
            <!-- Aperçu des permissions chargées -->
            <div v-if="loadedPermissions.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Permissions chargées ({{ loadedPermissions.length }})
              </h4>
              <div class="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="permission in loadedPermissions" :key="permission" class="text-xs text-gray-600">
                    • {{ permission }}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Boutons d'action -->
          <div class="flex justify-between space-x-3 pt-4 border-t border-gray-200">
            <router-link
              to="/profiles"
              class="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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
import Breadcrumb from '../components/Breadcrumb.vue'
import { profileService } from '../services/profileService'
import type { Profile } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Profils', path: '/profiles' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const form = ref({
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  status: 'active'
})

const loadedPermissions = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// Permissions disponibles pour le modèle Excel
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

// Télécharger le modèle Excel
const downloadTemplate = () => {
  // Créer un fichier Excel simple avec les permissions disponibles
  const csvContent = [
    ['Permission', 'Description', 'Activé'],
    ...availablePermissions.map(p => [p.key, p.label, 'OUI'])
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'modele_permissions.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  if (window.showNotification) {
    window.showNotification('success', 'Succès', 'Modèle téléchargé avec succès')
  }
}

// Gérer le chargement du fichier Excel
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV')
    }
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const lines = content.split('\n').filter(line => line.trim())
      
      const permissions: string[] = []
      
      // Parser le CSV (format simple)
      lines.forEach((line, index) => {
        if (index === 0) return // Ignorer l'en-tête
        
        const columns = line.split(',')
        if (columns.length >= 3) {
          const permission = columns[0].trim()
          const enabled = columns[2].trim().toUpperCase()
          
          if (enabled === 'OUI' || enabled === 'YES' || enabled === 'TRUE' || enabled === '1') {
            permissions.push(permission)
          }
        }
      })
      
      loadedPermissions.value = permissions
      form.value.permissions = permissions
      
      if (window.showNotification) {
        window.showNotification('success', 'Succès', `${permissions.length} permissions chargées avec succès`)
      }
    } catch (error) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Erreur lors de la lecture du fichier')
      }
    }
  }
  
  reader.readAsText(file)
}

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
      loadedPermissions.value = profile.permissions || []
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
