<template>
  <Layout title="Gestion des dossiers médicaux">
    <div class="space-y-6">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total dossiers"
          :value="folderStats.totalFolders.toString()"
          icon="folder"
          icon-color="blue"
        />
        <MetricCard
          title="Dossiers ce mois"
          :value="folderStats.foldersThisMonth.toString()"
          icon="folder-plus"
          icon-color="green"
        />
        <MetricCard
          title="Dossiers actifs"
          :value="folderStats.activeFolders.toString()"
          icon="folder-open"
          icon-color="purple"
        />
        <MetricCard
          title="Dossiers archivés"
          :value="folderStats.archivedFolders.toString()"
          icon="archive"
          icon-color="orange"
        />
      </div>

      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="openAddFolderModal" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="folder-plus" class="mr-1 md:mr-2" />
              Nouveau dossier
            </button>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher un dossier..."
                class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
              />
              <font-awesome-icon icon="search" class="absolute left-2 md:left-3 top-2.5 text-gray-400 text-sm" />
            </div>
            <select v-model="selectedStatus" @change="loadFolders" class="px-2 md:px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tous les statuts</option>
              <option value="1">Actif</option>
              <option value="2">Archivé</option>
              <option value="3">Fermé</option>
            </select>
          </div>
        </div>

        <!-- Tableau des dossiers médicaux -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Dossier</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnostic</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traitement</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date création</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="folder in medicalFolders" :key="folder.uuid" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <font-awesome-icon icon="folder" class="text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ folder.num_folder }}</p>
                      <p class="text-xs text-gray-500">{{ folder.uuid.substring(0, 8) }}...</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">Patient {{ folder.patient_uuid.substring(0, 8) }}...</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ getDiagnosisText(folder.diagnose_uuid) }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ folder.traitement }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(folder.created_at) }}</td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(folder.statut)" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(folder.statut) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <ActionButtons
                    @view="viewFolder(folder)"
                    @edit="editFolder(folder)"
                    @delete="deleteFolder(folder)"
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
import MetricCard from '../components/MetricCard.vue'
import ActionButtons from '../components/ActionButtons.vue'
import { medicalFolderService } from '../services/medicalFolderService'
import type { MedicalFolder, MedicalFolderStats } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'
import Swal from 'sweetalert2'

const router = useRouter()

// Variables réactives pour la pagination
const medicalFolders = ref<MedicalFolder[]>([])
const pagination = ref<PaginatedResponse<MedicalFolder>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedStatus = ref('')
const searchTimeout = ref<number | null>(null)


// Statistiques
const folderStats = computed(() => medicalFolderService.getMedicalFoldersStats())

// Fonctions utilitaires
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getDiagnosisText = (diagnoseUuid: string): string => {
  const diagnosis = medicalFolderService.getDiagnosisById(diagnoseUuid)
  return diagnosis ? diagnosis.libelle : 'Diagnostic non trouvé'
}

// Fonctions de pagination
const loadFolders = () => {
  const params: PaginationParams = {
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    filters: selectedStatus.value ? { statut: parseInt(selectedStatus.value) } : undefined,
    sortBy: 'created_at',
    sortOrder: 'desc'
  }
  
  const response = medicalFolderService.getMedicalFolders(params)
  medicalFolders.value = response.data
  pagination.value = response.pagination
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadFolders()
}

const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset à la première page lors de la recherche
    loadFolders()
  }, 500)
}

// Fonctions CRUD
const viewFolder = (folder: MedicalFolder) => {
  router.push(`/medical-records/${folder.uuid}`)
}

const editFolder = (folder: MedicalFolder) => {
  router.push(`/medical-records/${folder.uuid}/edit`)
}

const deleteFolder = async (folder: MedicalFolder) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce dossier médical ?',
    text: `Vous allez supprimer le dossier médical "${folder.num_folder}". Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    const success = medicalFolderService.deleteMedicalFolder(folder.uuid)
    if (success) {
      await Swal.fire({
        title: 'Supprimé !',
        text: `Le dossier médical ${folder.num_folder} a été supprimé avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      loadFolders() // Recharger la liste
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

const openAddFolderModal = () => {
  // Vérifier qu'on n'est pas sur une page complémentaire
  if (currentPage.value !== 1) {
    currentPage.value = 1
    loadFolders()
  }
  router.push('/medical-records/create')
}

// Fonctions pour les statuts
const getStatusText = (statut: number): string => {
  return medicalFolderService.getStatusText(statut)
}

const getStatusClass = (statut: number): string => {
  return medicalFolderService.getStatusClass(statut)
}

// Watchers
watch(selectedStatus, () => {
  currentPage.value = 1
  loadFolders()
})

// Lifecycle
onMounted(() => {
  loadFolders()
})
</script>