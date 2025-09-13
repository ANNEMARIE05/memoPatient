<template>
  <Layout title="Gestion des rendez-vous">
    <div class="space-y-6">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          :title="'Rendez-vous aujourd\'hui'"
          :value="appointmentStats.today.toString()"
          icon="calendar-day"
          icon-color="blue"
        />
        <MetricCard
          :title="'Cette semaine'"
          :value="appointmentStats.thisWeek.toString()"
          icon="calendar-week"
          icon-color="green"
        />
        <MetricCard
          :title="'En attente'"
          :value="appointmentStats.pending.toString()"
          icon="clock"
          icon-color="orange"
        />
        <MetricCard
          :title="'Annulés'"
          :value="appointmentStats.cancelled.toString()"
          icon="times-circle"
          icon-color="red"
        />
      </div>

      <!-- Actions et filtres -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-6 flex justify-between items-center">
          <div class="flex space-x-3">
            <button @click="openAddAppointmentModal" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="calendar-plus" class="mr-2" />
              Nouveau rendez-vous
            </button>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="toggleFilters" 
              class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <font-awesome-icon icon="filter" class="mr-2" />
              Filtres
            </button>
          </div>
        </div>

        <!-- Panneau de filtres avancés -->
        <div v-if="showFilters" class="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Filtre par date de début -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                v-model="filters.startDate"
                @change="applyFilters"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <!-- Filtre par date de fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                v-model="filters.endDate"
                @change="applyFilters"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <!-- Filtre par statut -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select 
                v-model="filters.status" 
                @change="applyFilters" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="0">En attente</option>
                <option value="1">Confirmé</option>
                <option value="2">En cours</option>
                <option value="3">Annulé</option>
                <option value="4">Terminé</option>
              </select>
            </div>
            
            <!-- Filtre par patient -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select 
                v-model="filters.patient" 
                @change="applyFilters" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les patients</option>
                <option v-for="patient in patients" :key="patient.uuid" :value="patient.uuid">
                  {{ patient.firstname }} {{ patient.lastname }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- Boutons d'action pour les filtres -->
          <div class="mt-4 flex justify-end space-x-3">
            <button 
              @click="clearFilters" 
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Effacer les filtres
            </button>
            <button 
              @click="toggleFilters" 
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>

        <!-- Tableau des rendez-vous -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date et heure</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médecin</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="appointment in appointments" :key="appointment.uuid" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ formatDateTime(appointment.date_edition) }}</p>
                    <p class="text-xs text-gray-500">{{ appointment.uuid.substring(0, 8) }}...</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <font-awesome-icon icon="user" class="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Patient {{ appointment.patient_uuid.substring(0, 8) }}...</p>
                      <p class="text-xs text-gray-500">ID: {{ appointment.patient_uuid.substring(0, 8) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ appointment.motif }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">Dr. Système</td>
                <td class="px-4 py-3 text-sm text-gray-900">30 min</td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(appointment.statut)" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(appointment.statut) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <ActionButtons
                    @view="viewAppointment(appointment)"
                    @edit="editAppointment(appointment)"
                    @delete="deleteAppointment(appointment)"
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
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import type { Appointment, AppointmentStats, Patient } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'
import Swal from 'sweetalert2'

const router = useRouter()

// Variables réactives pour la pagination
const appointments = ref<Appointment[]>([])
const pagination = ref<PaginatedResponse<Appointment>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// Variables pour les filtres
const showFilters = ref(false)
const patients = ref<Patient[]>([])
const filters = ref({
  startDate: '',
  endDate: '',
  status: '',
  patient: ''
})


// Statistiques
const appointmentStats = computed(() => appointmentService.getAppointmentsStats())

// Fonctions utilitaires
const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonctions de pagination
const loadAppointments = async () => {
  loading.value = true
  try {
    const params: PaginationParams = {
      page: currentPage.value,
      limit: pageSize.value,
      filters: {
        ...(filters.value.startDate ? { startDate: filters.value.startDate } : {}),
        ...(filters.value.endDate ? { endDate: filters.value.endDate } : {}),
        ...(filters.value.status ? { statut: parseInt(filters.value.status) } : {}),
        ...(filters.value.patient ? { patient_uuid: filters.value.patient } : {})
      },
      sortBy: 'date_edition',
      sortOrder: 'asc'
    }
    
    const response = appointmentService.getAppointments(params)
    appointments.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Erreur lors du chargement des rendez-vous:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les rendez-vous')
    }
  } finally {
    loading.value = false
  }
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadAppointments()
}

const onPageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize
  currentPage.value = 1 // Reset à la première page
  loadAppointments()
}

// Fonctions CRUD
const viewAppointment = (appointment: Appointment) => {
  router.push(`/appointments/${appointment.uuid}`)
}

const editAppointment = (appointment: Appointment) => {
  router.push(`/appointments/${appointment.uuid}/edit`)
}

const deleteAppointment = async (appointment: Appointment) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
    text: `Vous allez supprimer le rendez-vous "${appointment.motif}". Cette action est irréversible.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    const success = appointmentService.deleteAppointment(appointment.uuid)
    if (success) {
      await Swal.fire({
        title: 'Supprimé !',
        text: `Le rendez-vous ${appointment.motif} a été supprimé avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      loadAppointments() // Recharger la liste
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

const openAddAppointmentModal = () => {
  // Vérifier qu'on n'est pas sur une page complémentaire
  if (currentPage.value !== 1) {
    currentPage.value = 1
    loadAppointments()
  }
  router.push('/appointments/create')
}

// Fonctions pour les filtres
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const applyFilters = () => {
  currentPage.value = 1
  loadAppointments()
}

const clearFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    status: '',
    patient: ''
  }
  currentPage.value = 1
  loadAppointments()
}

const loadPatients = () => {
  patients.value = patientService.getAllPatients()
}

// Fonctions pour les statuts
const getStatusText = (statut: number): string => {
  return appointmentService.getStatusText(statut)
}

const getStatusClass = (statut: number): string => {
  return appointmentService.getStatusClass(statut)
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
  loadAppointments()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadAppointments()
  loadPatients()
})
</script>