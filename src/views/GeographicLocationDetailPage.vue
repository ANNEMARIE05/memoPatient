<template>
  <Layout title="Détails de la localisation">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Contenu principal -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="!location" class="text-center py-8">
        <font-awesome-icon icon="exclamation-triangle" class="text-gray-400 text-4xl mb-4" />
        <p class="text-gray-500">Localisation non trouvée</p>
        <router-link
          to="/geographic-locations"
          class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <font-awesome-icon icon="arrow-left" class="mr-2" />
          Retour à la liste
        </router-link>
      </div>

      <div v-else>
        <!-- En-tête avec actions -->
        <div class="bg-white border border-gray-200 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-12 w-12">
                  <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <font-awesome-icon :icon="getLocationIcon(location.type)" class="text-blue-600 text-lg" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    {{ location.name }}
                  </h2>
                  <p class="text-sm text-gray-500">{{ getTypeText(location.type) }} • ID: {{ location.id }}</p>
                </div>
              </div>
              <div class="flex space-x-3">
                <router-link
                  to="/geographic-locations"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <font-awesome-icon icon="arrow-left" class="mr-2" />
                  Retour à la liste
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations de la localisation -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Informations générales -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Informations générales</h3>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Nom</label>
                <p class="mt-1 text-sm text-gray-900">{{ location.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Type</label>
                <span :class="getTypeClass(location.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getTypeText(location.type) }}
                </span>
              </div>

              <div v-if="location.postalCode">
                <label class="block text-sm font-medium text-gray-500">Code postal</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ location.postalCode }}</p>
              </div>

              <div v-if="location.parentId">
                <label class="block text-sm font-medium text-gray-500">Parent</label>
                <p class="mt-1 text-sm text-gray-900">{{ getParentName(location.parentId) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Statut</label>
                <span :class="location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ location.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Informations géographiques -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Informations géographiques</h3>
            </div>
            <div class="p-6 space-y-4">
              <div v-if="location.coordinates">
                <label class="block text-sm font-medium text-gray-500">Coordonnées</label>
                <div class="mt-1 space-y-1">
                  <p class="text-sm text-gray-900">
                    <span class="font-medium">Latitude:</span> {{ location.coordinates.latitude }}
                  </p>
                  <p class="text-sm text-gray-900">
                    <span class="font-medium">Longitude:</span> {{ location.coordinates.longitude }}
                  </p>
                </div>
              </div>

              <div v-if="location.coordinates">
                <label class="block text-sm font-medium text-gray-500">Carte</label>
                <div class="mt-1 p-4 bg-gray-50 rounded-md">
                  <p class="text-sm text-gray-600 text-center">
                    <font-awesome-icon icon="map" class="mr-2" />
                    Carte interactive à implémenter
                  </p>
                </div>
              </div>

              <div v-if="childrenLocations.length > 0">
                <label class="block text-sm font-medium text-gray-500">Sous-lieux ({{ childrenLocations.length }})</label>
                <div class="mt-1 space-y-2">
                  <div v-for="child in childrenLocations.slice(0, 5)" :key="child.id" 
                       class="flex items-center space-x-2 text-sm">
                    <font-awesome-icon :icon="getLocationIcon(child.type)" class="text-gray-400" />
                    <span class="text-gray-900">{{ child.name }}</span>
                    <span :class="getTypeClass(child.type)" class="px-1.5 py-0.5 rounded text-xs">
                      {{ getTypeText(child.type) }}
                    </span>
                  </div>
                  <p v-if="childrenLocations.length > 5" class="text-xs text-gray-500">
                    + {{ childrenLocations.length - 5 }} autres...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations système -->
        <div class="mt-6 bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations système</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">ID de la localisation</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ location.id }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Date de création</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(location.createdAt) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Dernière modification</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(location.updatedAt) }}</p>
              </div>

              <div v-if="locationHierarchy.length > 1">
                <label class="block text-sm font-medium text-gray-500">Hiérarchie</label>
                <div class="mt-1 flex items-center space-x-1 text-sm text-gray-900">
                  <span v-for="(item, index) in locationHierarchy" :key="item.id">
                    {{ item.name }}
                    <font-awesome-icon v-if="index < locationHierarchy.length - 1" icon="chevron-right" class="mx-1 text-xs" />
                  </span>
                </div>
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
import { geographicLocationService } from '../services/geographicLocationService'
import type { GeographicLocation } from '../services/geographicLocationService'

const route = useRoute()
const router = useRouter()

const location = ref<GeographicLocation | undefined>()
const loading = ref(true)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Localisations', path: '/geographic-locations' },
  { label: 'Détails', path: '' }
])

// Données calculées
const childrenLocations = computed(() => {
  if (!location.value) return []
  return geographicLocationService.getLocationsByParent(location.value.id)
})

const locationHierarchy = computed(() => {
  if (!location.value) return []
  return geographicLocationService.getLocationHierarchy(location.value.id)
})



// Fonctions utilitaires
const getLocationIcon = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'globe'
    case 'region': return 'map'
    case 'city': return 'city'
    case 'district': return 'building'
    default: return 'map-marker-alt'
  }
}

const getTypeClass = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'bg-blue-100 text-blue-800'
    case 'region': return 'bg-green-100 text-green-800'
    case 'city': return 'bg-purple-100 text-purple-800'
    case 'district': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: GeographicLocation['type']): string => {
  switch (type) {
    case 'country': return 'Pays'
    case 'region': return 'Région'
    case 'city': return 'Ville'
    case 'district': return 'Arrondissement'
    default: return 'Autre'
  }
}

const getParentName = (parentId: string): string => {
  const parent = geographicLocationService.getLocationById(parentId)
  return parent?.name || 'Non trouvé'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}



// Charger les données de la localisation
onMounted(() => {
  if (route.params.id) {
    location.value = geographicLocationService.getLocationById(route.params.id as string)
    if (!location.value) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Localisation non trouvée')
      }
      router.push('/geographic-locations')
    }
  }
  loading.value = false
})
</script>
