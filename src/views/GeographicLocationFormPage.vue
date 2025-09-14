<template>
  <Layout :title="isEdit ? 'Modifier la localisation' : 'Nouvelle localisation'">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <StepForm
      :title="isEdit ? 'Modifier la localisation' : 'Nouvelle localisation'"
      :steps="steps"
      :form="form"
      :is-loading="loading"
      :submit-text="isEdit ? 'Mettre à jour' : 'Créer'"
      @submit="handleSubmit"
      @back="goBack"
    >
      <!-- Étape 1: Informations générales -->
      <template #step-0="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Nom de la localisation"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez le type</option>
              <option value="country">Pays</option>
              <option value="region">Région</option>
              <option value="city">Ville</option>
              <option value="district">Arrondissement/Quartier</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
            <input
              v-model="form.postalCode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Code postal"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Localisation parente</label>
            <select
              v-model="form.parentId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Aucune (localisation racine)</option>
              <option v-for="location in availableParents" :key="location.id" :value="location.id">
                {{ location.name }} ({{ getTypeText(location.type) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              v-model="form.isActive"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option :value="true">Actif</option>
              <option :value="false">Inactif</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Étape 2: Coordonnées géographiques -->
      <template #step-1="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              v-model.number="form.latitude"
              type="number"
              step="any"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: 48.8566"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              v-model.number="form.longitude"
              type="number"
              step="any"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: 2.3522"
            />
          </div>
        </div>

        <div class="mt-4 p-4 bg-blue-50 rounded-md">
          <p class="text-sm text-blue-800">
            <font-awesome-icon icon="info-circle" class="mr-2" />
            Les coordonnées sont optionnelles mais recommandées pour les villes et arrondissements.
            Vous pouvez les laisser vides si elles ne sont pas disponibles.
          </p>
        </div>
      </template>
    </StepForm>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import StepForm from '../components/StepForm.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { geographicLocationService } from '../services/geographicLocationService'
import type { GeographicLocation } from '../services/geographicLocationService'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Localisations', path: '/geographic-locations' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const steps = [
  {
    title: 'Informations générales',
    description: 'Saisissez les informations de base de la localisation',
    fields: ['name', 'type', 'postalCode', 'parentId', 'isActive']
  },
  {
    title: 'Coordonnées géographiques',
    description: 'Ajoutez les coordonnées GPS (optionnel)',
    fields: ['latitude', 'longitude']
  }
]

const form = ref({
  name: '',
  type: '' as GeographicLocation['type'],
  postalCode: '',
  parentId: '',
  isActive: true,
  latitude: null as number | null,
  longitude: null as number | null
})

// Données calculées
const availableParents = computed(() => {
  const allLocations = geographicLocationService.getAllLocations()
  const currentId = route.params.id as string
  
  // Filtrer les localisations qui peuvent être des parents
  return allLocations.filter(location => {
    // Ne pas inclure la localisation actuelle en mode édition
    if (isEdit.value && location.id === currentId) return false
    
    // Selon le type de la localisation courante, déterminer les parents possibles
    const currentType = form.value.type
    if (!currentType) return true // Si aucun type sélectionné, montrer tous
    
    // Logique hiérarchique : pays > région > ville > arrondissement
    switch (currentType) {
      case 'country':
        return false // Un pays n'a pas de parent
      case 'region':
        return location.type === 'country'
      case 'city':
        return location.type === 'region'
      case 'district':
        return location.type === 'city'
      default:
        return true
    }
  })
})

// Fonctions utilitaires
const getTypeText = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'Pays'
    case 'region': return 'Région'
    case 'city': return 'Ville'
    case 'district': return 'Arrondissement'
    default: return 'Autre'
  }
}

// Fonction pour retourner en arrière
const goBack = () => {
  if (isEdit.value) {
    router.push(`/geographic-locations/${route.params.id}`)
  } else {
    router.push('/geographic-locations')
  }
}

// Charger les données de la localisation en mode édition
onMounted(() => {
  if (isEdit.value && route.params.id) {
    const location = geographicLocationService.getLocationById(route.params.id as string)
    if (location) {
      form.value = {
        name: location.name,
        type: location.type,
        postalCode: location.postalCode || '',
        parentId: location.parentId || '',
        isActive: location.isActive,
        latitude: location.coordinates?.latitude || null,
        longitude: location.coordinates?.longitude || null
      }
    } else {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Localisation non trouvée')
      }
      router.push('/geographic-locations')
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Validation
    if (!form.value.name.trim()) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Le nom est obligatoire')
      }
      return
    }
    
    if (!form.value.type) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Le type est obligatoire')
      }
      return
    }

    // Préparer les données
    const locationData: Omit<GeographicLocation, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.value.name.trim(),
      type: form.value.type,
      postalCode: form.value.postalCode.trim() || undefined,
      parentId: form.value.parentId || undefined,
      isActive: form.value.isActive,
      coordinates: (form.value.latitude && form.value.longitude) ? {
        latitude: form.value.latitude,
        longitude: form.value.longitude
      } : undefined
    }
    
    if (isEdit.value && route.params.id) {
      // Mode édition
      const updatedLocation = geographicLocationService.updateLocation(route.params.id as string, locationData)
      
      if (updatedLocation) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Localisation mise à jour avec succès')
        }
        router.push(`/geographic-locations/${route.params.id}`)
      } else {
        if (window.showNotification) {
          window.showNotification('error', 'Erreur', 'Impossible de mettre à jour la localisation')
        }
      }
    } else {
      // Mode création
      const newLocation = geographicLocationService.addLocation(locationData)
      
      if (newLocation) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Localisation créée avec succès')
        }
        router.push('/geographic-locations')
      } else {
        if (window.showNotification) {
          window.showNotification('error', 'Erreur', 'Impossible de créer la localisation')
        }
      }
    }
  } catch (error: any) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', error.message || 'Une erreur est survenue')
    }
  } finally {
    loading.value = false
  }
}
</script>
