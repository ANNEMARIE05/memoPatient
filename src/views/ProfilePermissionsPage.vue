<template>
  <Layout title="Modifier les permissions du profil">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/profiles" class="hover:text-blue-600">Profils</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link :to="`/profiles/${profile?.id}`" class="hover:text-blue-600">{{ profile?.name }}</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">Permissions</span>
        </nav>
      </div>

      <!-- En-tête -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                Modifier les permissions - {{ profile?.name }}
              </h2>
              <p class="text-sm text-gray-500">{{ profile?.code }}</p>
            </div>
            <router-link
              :to="`/profiles/${profile?.id}`"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <font-awesome-icon icon="arrow-left" class="mr-2" />
              Retour aux détails
            </router-link>
          </div>
        </div>
      </div>

      <!-- Formulaire de modification des permissions -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Modification des permissions</h3>
        </div>

        <div class="p-6 space-y-6">
          <!-- Permissions actuelles -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Permissions actuelles</h4>
            <div v-if="profile?.permissions && profile.permissions.length > 0" class="bg-gray-50 rounded-md p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="permission in groupedCurrentPermissions" :key="permission.category" class="mb-3">
                  <h5 class="text-xs font-medium text-gray-600 mb-1">{{ permission.category }}</h5>
                  <div class="space-y-1">
                    <div v-for="perm in permission.permissions" :key="perm" class="text-xs text-gray-600">
                      • {{ getPermissionLabel(perm) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">
              Aucune permission définie
            </div>
          </div>

          <!-- Chargement de fichier -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-700">Charger de nouvelles permissions</h4>
              <button
                @click="downloadTemplate"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <font-awesome-icon icon="download" class="mr-1" />
                Télécharger le modèle
              </button>
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
                  accept=".xlsx,.xls,.csv"
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
              <h5 class="text-sm font-medium text-gray-700 mb-2">
                Nouvelles permissions ({{ loadedPermissions.length }})
              </h5>
              <div class="bg-blue-50 rounded-md p-3 max-h-40 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div v-for="permission in groupedLoadedPermissions" :key="permission.category" class="mb-2">
                    <h6 class="text-xs font-medium text-blue-800 mb-1">{{ permission.category }}</h6>
                    <div class="space-y-1">
                      <div v-for="perm in permission.permissions" :key="perm" class="text-xs text-blue-700">
                        • {{ getPermissionLabel(perm) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-between space-x-3 pt-6 border-t border-gray-200">
            <router-link
              :to="`/profiles/${profile?.id}`"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </router-link>
            <button
              @click="handleUpdatePermissions"
              :disabled="loading || loadedPermissions.length === 0"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Mise à jour...' : 'Mettre à jour les permissions' }}
            </button>
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
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const profile = ref<Profile | undefined>()
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

// Charger les données du profil
onMounted(() => {
  if (route.params.id) {
    profile.value = profileService.getProfileById(route.params.id as string)
    if (!profile.value) {
      Swal.fire({
        title: 'Erreur !',
        text: 'Profil non trouvé',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/profiles')
      })
    }
  }
})

// Grouper les permissions actuelles par catégorie
const groupedCurrentPermissions = computed(() => {
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

// Grouper les permissions chargées par catégorie
const groupedLoadedPermissions = computed(() => {
  if (!loadedPermissions.value.length) return []
  
  const groups: Record<string, string[]> = {}
  
  loadedPermissions.value.forEach((permission: string) => {
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

// Télécharger le modèle Excel
const downloadTemplate = () => {
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
  
  Swal.fire({
    title: 'Succès !',
    text: 'Modèle téléchargé avec succès',
    icon: 'success',
    confirmButtonText: 'OK'
  })
}

// Gérer le chargement du fichier Excel
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
    Swal.fire({
      title: 'Erreur !',
      text: 'Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV',
      icon: 'error',
      confirmButtonText: 'OK'
    })
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
      
      Swal.fire({
        title: 'Succès !',
        text: `${permissions.length} permissions chargées avec succès`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
    } catch (error) {
      Swal.fire({
        title: 'Erreur !',
        text: 'Erreur lors de la lecture du fichier',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }
  
  reader.readAsText(file)
}

// Mettre à jour les permissions
const handleUpdatePermissions = async () => {
  if (!profile.value?.id || loadedPermissions.value.length === 0) return

  const result = await Swal.fire({
    title: 'Confirmer la mise à jour',
    text: `Vous allez remplacer les permissions actuelles par ${loadedPermissions.value.length} nouvelles permissions.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, mettre à jour',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    loading.value = true
    
    try {
      const updatedProfile = profileService.updateProfile(profile.value.id, {
        permissions: loadedPermissions.value
      })
      
      if (updatedProfile) {
        await Swal.fire({
          title: 'Succès !',
          text: 'Permissions mises à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        router.push(`/profiles/${profile.value.id}`)
      } else {
        await Swal.fire({
          title: 'Erreur !',
          text: 'Erreur lors de la mise à jour des permissions',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    } catch (error) {
      await Swal.fire({
        title: 'Erreur !',
        text: 'Une erreur est survenue lors de la mise à jour',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      loading.value = false
    }
  }
}
</script>
