<template>
  <Layout title="Gestion des patients">
    <div class="space-y-6">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total patients"
          :value="patientStats.total.toString()"
          icon="users"
          icon-color="blue"
        />
        <MetricCard
          title="Patients actifs"
          :value="patientStats.active.toString()"
          icon="user-check"
          icon-color="green"
        />
        <MetricCard
          title="Nouveaux ce mois"
          :value="patientStats.newThisMonth.toString()"
          icon="user-plus"
          icon-color="purple"
        />
        <MetricCard
          title="Femmes & Hommes"
          :value="`${patientStats.genderDistribution.female} / ${patientStats.genderDistribution.male}`"
          icon="users"
          icon-color="purple"
        />
      </div>

      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button @click="openAddPatientModal" class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors">
              <font-awesome-icon icon="user-plus" class="mr-1 md:mr-2" />
              Nouveau patient
            </button>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="onSearchChange"
                type="text"
                placeholder="Rechercher un patient..."
                class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
              />
              <font-awesome-icon icon="search" class="absolute left-2 md:left-3 top-2.5 text-gray-400 text-sm" />
            </div>
            <select v-model="selectedGenre" @change="loadPatients" class="px-2 md:px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tous les patients</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
            <div class="flex space-x-2">
              <input
                v-model="dateStart"
                @change="loadPatients"
                type="date"
                placeholder="Date début"
                class="px-2 md:px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                v-model="dateEnd"
                @change="loadPatients"
                type="date"
                placeholder="Date fin"
                class="px-2 md:px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Tableau des patients -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière visite</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Indicateur de chargement -->
              <tr v-if="loading" class="bg-gray-50">
                <td colspan="7" class="px-4 py-8 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <font-awesome-icon icon="spinner" class="animate-spin text-blue-600" />
                    <span class="text-gray-600">Chargement des patients...</span>
                  </div>
                </td>
              </tr>
              
              <!-- Message si aucun résultat -->
              <tr v-else-if="!loading && patients.length === 0" class="bg-gray-50">
                <td colspan="7" class="px-4 py-8 text-center">
                  <div class="text-gray-500">
                    <font-awesome-icon icon="inbox" class="text-4xl mb-2" />
                    <p>Aucun patient trouvé</p>
                    <p class="text-sm">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
              
              <!-- Données des patients -->
              <tr v-else v-for="patient in patients" :key="patient.uuid" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <font-awesome-icon icon="user" class="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ patient.firstname }} {{ patient.lastname }}</p>
                      <p class="text-xs text-gray-500">{{ patient.uuid.substring(0, 8) }}...</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ calculateAge(patient.birthdate) }} ans</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ patient.phone1 }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ patient.email }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(patient.updated_at) }}</td>
                <td class="px-4 py-3">
                  <span class="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                    Actif
                  </span>
                </td>
                <td class="px-4 py-3">
                  <ActionButtons
                    @view="viewPatient(patient)"
                    @edit="editPatient(patient)"
                    @delete="deletePatient(patient)"
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
import { patientService } from '../services/patientService'
import type { Patient, PatientStats } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import type { PaginationParams, PaginatedResponse } from '../types/global'

const router = useRouter()

// Variables réactives
const patients = ref<Patient[]>([])
const pagination = ref<PaginatedResponse<Patient>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedGenre = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const searchTimeout = ref<number | null>(null)
const loading = ref(false)

// Statistiques
const patientStats = computed(() => patientService.getPatientsStats())

// Fonctions utilitaires
const calculateAge = (birthdate: string): number => {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Fonctions de chargement
const loadPatients = async () => {
  loading.value = true
  try {
    // Charger tous les patients sans pagination
    const allPatients = await patientService.getAllPatients()
    
    // Appliquer les filtres
    let filteredPatients = allPatients
    
    // Filtre de recherche
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredPatients = filteredPatients.filter(patient => 
        patient.firstname.toLowerCase().includes(query) ||
        patient.lastname.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone1.includes(query)
      )
    }
    
    // Filtre par genre
    if (selectedGenre.value) {
      filteredPatients = filteredPatients.filter(patient => patient.genre === selectedGenre.value)
    }
    
    // Filtre par date
    if (dateStart.value) {
      filteredPatients = filteredPatients.filter(patient => 
        new Date(patient.created_at) >= new Date(dateStart.value)
      )
    }
    
    if (dateEnd.value) {
      filteredPatients = filteredPatients.filter(patient => 
        new Date(patient.created_at) <= new Date(dateEnd.value)
      )
    }
    
    patients.value = filteredPatients
  } catch (error) {
    console.error('Erreur lors du chargement des patients:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les patients')
    }
  } finally {
    loading.value = false
  }
}

const onSearchChange = () => {
  // Debounce de la recherche
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    loadPatients()
  }, 500)
}

// Fonctions CRUD
const viewPatient = (patient: Patient) => {
  router.push(`/patients/${patient.uuid}`)
}

const editPatient = (patient: Patient) => {
  router.push(`/patients/${patient.uuid}/edit`)
}

const deletePatient = async (patient: Patient) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce patient ?',
    text: `Vous allez supprimer le patient "${patient.firstname} ${patient.lastname}". Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    const success = patientService.deletePatient(patient.uuid)
    if (success) {
      await Swal.fire({
        title: 'Supprimé !',
        text: `Le patient ${patient.firstname} ${patient.lastname} a été supprimé avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      loadPatients() // Recharger la liste
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

const openAddPatientModal = () => {
  // Vérifier qu'on n'est pas sur une page complémentaire
  if (currentPage.value !== 1) {
    currentPage.value = 1
    loadPatients()
  }
  router.push('/patients/create')
}

// Watchers
watch(selectedGenre, () => {
  currentPage.value = 1
  loadPatients()
})

watch([dateStart, dateEnd], () => {
  currentPage.value = 1
  loadPatients()
})

// Lifecycle
onMounted(() => {
  loadPatients()
})
</script>