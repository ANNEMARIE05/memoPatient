<template>
  <Layout title="Dashboard de Localisation">
    <div class="space-y-6">
      <!-- Statistiques de localisation -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Langues supportées"
          :value="localizationStats.supportedLanguages.toString()"
          icon="globe"
          icon-color="blue"
        />
        <MetricCard
          title="Traductions complètes"
          :value="localizationStats.completeTranslations.toString()"
          icon="check-circle"
          icon-color="green"
        />
        <MetricCard
          title="Traductions partielles"
          :value="localizationStats.partialTranslations.toString()"
          icon="exclamation-triangle"
          icon-color="orange"
        />
        <MetricCard
          title="Clés manquantes"
          :value="localizationStats.missingKeys.toString()"
          icon="times-circle"
          icon-color="red"
        />
      </div>

      <!-- Actions principales -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <h2 class="text-lg font-semibold text-gray-900">Gestion des langues</h2>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="addNewLanguage" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="plus" class="mr-2" />
              Ajouter une langue
            </button>
            <button @click="exportTranslations" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="download" class="mr-2" />
              Exporter les traductions
            </button>
            <button @click="importTranslations" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="upload" class="mr-2" />
              Importer les traductions
            </button>
          </div>
        </div>

        <!-- Liste des langues -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Langue</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière mise à jour</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="language in languages" :key="language.code" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-blue-600 font-bold text-sm">{{ language.flag }}</span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ language.name }}</p>
                      <p class="text-xs text-gray-500">{{ language.nativeName }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 font-mono">{{ language.code }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        :class="getProgressBarClass(language.progress)"
                        class="h-2 rounded-full transition-all duration-300"
                        :style="{ width: language.progress + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-600">{{ language.progress }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(language.status)" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(language.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(language.lastUpdated) }}</td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <button @click="editLanguage(language)" class="text-blue-600 hover:text-blue-800 text-sm" title="Modifier">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button @click="translateLanguage(language)" class="text-green-600 hover:text-green-800 text-sm" title="Traduire">
                      <font-awesome-icon icon="language" />
                    </button>
                    <button @click="deleteLanguage(language)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Graphiques de progression -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Progression par langue -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Progression par langue</h3>
          <div class="space-y-4">
            <div v-for="language in languages" :key="language.code" class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-700 mr-3">{{ language.flag }} {{ language.name }}</span>
              </div>
              <div class="flex items-center w-32">
                <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    :class="getProgressBarClass(language.progress)"
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ width: language.progress + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-gray-600">{{ language.progress }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques des clés -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition des clés de traduction</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Clés traduites</span>
              <span class="text-sm font-medium text-green-600">{{ keyStats.translated }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Clés manquantes</span>
              <span class="text-sm font-medium text-red-600">{{ keyStats.missing }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Clés obsolètes</span>
              <span class="text-sm font-medium text-orange-600">{{ keyStats.obsolete }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total des clés</span>
              <span class="text-sm font-medium text-gray-900">{{ keyStats.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import MetricCard from '../components/MetricCard.vue'
import { localizationService } from '../services/localizationService'
import type { Language, LocalizationStats, KeyStats } from '../types/global'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// Les types sont maintenant importés depuis global.d.ts

// Variables réactives
const languages = ref<Language[]>([])

// Statistiques calculées
const localizationStats = computed<LocalizationStats>(() => localizationService.getLocalizationStats())
const keyStats = computed<KeyStats>(() => localizationService.getKeyStats())

// Fonctions utilitaires
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getProgressBarClass = (progress: number): string => {
  if (progress === 100) return 'bg-green-500'
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-yellow-500'
  if (progress >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'incomplete':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Actif'
    case 'incomplete':
      return 'Incomplet'
    case 'inactive':
      return 'Inactif'
    default:
      return 'Inconnu'
  }
}

// Fonctions d'action
const addNewLanguage = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Ajouter une langue', 'Fonctionnalité d\'ajout de langue à implémenter')
  }
}

const exportTranslations = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Export', 'Export des traductions en cours...')
  }
}

const importTranslations = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Import', 'Import des traductions à implémenter')
  }
}

const editLanguage = (language: Language) => {
  if (window.showNotification) {
    window.showNotification('info', 'Modifier', `Modification de la langue ${language.name}`)
  }
}

const translateLanguage = (language: Language) => {
  if (window.showNotification) {
    window.showNotification('info', 'Traduction', `Ouverture de l'éditeur de traduction pour ${language.name}`)
  }
}

const deleteLanguage = async (language: Language) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cette langue ?',
    text: `Vous allez supprimer la langue "${language.name}". Toutes les traductions associées seront perdues. Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    const success = localizationService.deleteLanguage(language.code)
    if (success) {
      await Swal.fire({
        title: 'Supprimé !',
        text: `La langue ${language.name} a été supprimée avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      loadLanguages() // Recharger la liste
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

// Chargement des données
const loadLanguages = () => {
  const response = localizationService.getLanguages({ page: 1, limit: 50 })
  languages.value = response.data
}

// Lifecycle
onMounted(() => {
  loadLanguages()
})
</script>

