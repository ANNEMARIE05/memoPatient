<template>
  <Layout title="Détails du rendez-vous">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- En-tête avec actions -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                Rendez-vous #{{ appointment?.uuid }}
              </h2>
              <p class="text-sm text-gray-500">{{ getPatientName(appointment?.patient_uuid) }}</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                to="/appointments"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <font-awesome-icon icon="arrow-left" class="mr-2" />
                Retour à la liste
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du rendez-vous -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations générales</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Patient</label>
              <p class="mt-1 text-sm text-gray-900">{{ getPatientName(appointment?.patient_uuid) }}</p>
              <router-link
                :to="`/patients/${appointment?.patient_uuid}`"
                class="text-xs text-blue-600 hover:text-blue-800"
              >
                Voir le profil du patient →
              </router-link>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Date et heure</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(appointment?.date_edition) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Motif</label>
              <p class="mt-1 text-sm text-gray-900">{{ appointment?.motif }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Statut</label>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(appointment?.statut)
              ]">
                {{ getStatusText(appointment?.statut) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Actions rapides</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <button
                v-if="appointment?.statut === 0"
                @click="updateStatus(1)"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <font-awesome-icon icon="check" class="mr-2" />
                Confirmer le rendez-vous
              </button>
              
              
              <button
                v-if="appointment?.statut === 2"
                @click="updateStatus(4)"
                class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <font-awesome-icon icon="flag-checkered" class="mr-2" />
                Marquer comme terminé
              </button>
              
              <button
                v-if="appointment?.statut !== 3 && appointment?.statut !== 4"
                @click="updateStatus(3)"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <font-awesome-icon icon="times" class="mr-2" />
                Annuler le rendez-vous
              </button>
              
              <router-link
                :to="`/sms?appointment=${appointment?.uuid}`"
                class="w-full block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-center"
              >
                <font-awesome-icon icon="sms" class="mr-2" />
                Envoyer un SMS
              </router-link>
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
              <label class="block text-sm font-medium text-gray-500">ID du rendez-vous</label>
              <p class="mt-1 text-sm text-gray-900 font-mono">{{ appointment?.uuid }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Date de création</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(appointment?.created_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Dernière modification</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(appointment?.updated_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Créé par</label>
              <p class="mt-1 text-sm text-gray-900">{{ getDoctorName(appointment?.created_user) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import { userService } from '../services/userService'
import type { Appointment } from '../types/global'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const appointment = ref<Appointment | undefined>()

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Rendez-vous', path: '/appointments' },
  { label: 'Détails', path: '' }
])

// Charger les données du rendez-vous
onMounted(() => {
  if (route.params.uuid) {
    appointment.value = appointmentService.getAppointmentById(route.params.uuid as string)
    if (!appointment.value) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Rendez-vous non trouvé')
      }
      router.push('/appointments')
    }
  }
})

// Obtenir le nom d'un patient
const getPatientName = (patientUuid?: string): string => {
  if (!patientUuid) return 'Non défini'
  const patient = patientService.getPatientById(patientUuid)
  return patient ? `${patient.firstname} ${patient.lastname}` : 'Patient non trouvé'
}

// Obtenir le nom d'un médecin
const getDoctorName = (doctorUuid?: string): string => {
  if (!doctorUuid) return 'Non défini'
  const doctor = userService.getUserById(doctorUuid)
  return doctor ? `Dr. ${doctor.firstname} ${doctor.lastname}` : 'Médecin non trouvé'
}

// Obtenir le texte du statut
const getStatusText = (statut?: number): string => {
  return appointmentService.getStatusText(statut || 0)
}

// Obtenir la classe CSS du statut
const getStatusClass = (statut?: number): string => {
  return appointmentService.getStatusClass(statut || 0)
}

// Formater une date et heure
const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formater une date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Mettre à jour le statut
const updateStatus = (newStatus: number) => {
  if (appointment.value?.uuid) {
    const updated = appointmentService.updateAppointment(appointment.value.uuid, { statut: newStatus })
    if (updated) {
      appointment.value.statut = newStatus
      if (window.showNotification) {
        window.showNotification('success', 'Succès', 'Statut du rendez-vous mis à jour')
      }
    }
  }
}

</script>
