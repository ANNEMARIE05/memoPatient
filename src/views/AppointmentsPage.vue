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
        <div class="mb-4 flex justify-between items-center">
          <div class="flex space-x-3">
            <button @click="openAddAppointmentModal" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="calendar-plus" class="mr-2" />
              Nouveau rendez-vous
            </button>
          </div>
          <div class="flex space-x-3">
            <div class="relative">
              <input
                v-model="selectedDate"
                @change="loadAppointments"
                type="date"
                class="px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select v-model="selectedStatus" @change="loadAppointments" class="px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tous les rendez-vous</option>
              <option value="1">Confirmés</option>
              <option value="2">En attente</option>
              <option value="3">Annulés</option>
            </select>
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
                  <div class="flex space-x-2">
                    <button @click="viewAppointment(appointment)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                      <font-awesome-icon icon="eye" />
                    </button>
                    <button @click="editAppointment(appointment)" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button @click="deleteAppointment(appointment)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <PaginationComponent
          v-if="pagination && pagination.totalPages > 1"
          :pagination="pagination"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import MetricCard from '../components/MetricCard.vue'
import PaginationComponent from '../components/PaginationComponent.vue'
import { appointmentService } from '../services/appointmentService'
import type { Appointment, AppointmentStats } from '../types/global'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginationParams, PaginatedResponse } from '../types/global'

const router = useRouter()

// Variables réactives pour la pagination
const appointments = ref<Appointment[]>([])
const pagination = ref<PaginatedResponse<Appointment>['pagination'] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedDate = ref('')
const selectedStatus = ref('')

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
const loadAppointments = () => {
  const params: PaginationParams = {
    page: currentPage.value,
    limit: pageSize.value,
    filters: {
      ...(selectedDate.value ? { date: selectedDate.value } : {}),
      ...(selectedStatus.value ? { statut: parseInt(selectedStatus.value) } : {})
    },
    sortBy: 'date_edition',
    sortOrder: 'asc'
  }
  
  const response = appointmentService.getAppointments(params)
  appointments.value = response.data
  pagination.value = response.pagination
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadAppointments()
}

// Fonctions CRUD
const viewAppointment = (appointment: Appointment) => {
  router.push(`/appointments/${appointment.uuid}`)
}

const editAppointment = (appointment: Appointment) => {
  router.push(`/appointments/${appointment.uuid}/edit`)
}

const deleteAppointment = (appointment: Appointment) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le rendez-vous ${appointment.motif} ?`)) {
    const success = appointmentService.deleteAppointment(appointment.uuid)
    if (success && window.showNotification) {
      window.showNotification('success', 'Rendez-vous supprimé', `${appointment.motif} a été supprimé avec succès`)
      loadAppointments() // Recharger la liste
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

// Fonctions pour les statuts
const getStatusText = (statut: number): string => {
  return appointmentService.getStatusText(statut)
}

const getStatusClass = (statut: number): string => {
  return appointmentService.getStatusClass(statut)
}

// Watchers
watch([selectedDate, selectedStatus], () => {
  currentPage.value = 1
  loadAppointments()
})

// Lifecycle
onMounted(() => {
  loadAppointments()
})
</script>