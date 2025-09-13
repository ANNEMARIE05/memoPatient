<template>
  <Layout title="Détails du patient">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <div v-if="patient" class="space-y-6">
      <!-- En-tête avec informations principales -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="user" class="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ patient.firstname }} {{ patient.lastname }}</h1>
              <p class="text-gray-600">ID: {{ patient.uuid }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="editPatient" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <font-awesome-icon icon="edit" class="mr-2" />
              Modifier
            </button>
            <button @click="goBack" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
              <font-awesome-icon icon="arrow-left" class="mr-2" />
              Retour
            </button>
          </div>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Prénom</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.firstname }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.lastname }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de naissance</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(patient.birthdate) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Âge</label>
            <p class="mt-1 text-sm text-gray-900">{{ calculateAge(patient.birthdate) }} ans</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sexe</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.sexe }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Genre</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.genre }}</p>
          </div>
        </div>
      </div>

      <!-- Informations de contact -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone principal</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.phone1 }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone secondaire</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.phone2 || 'Non renseigné' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Adresse</label>
            <p class="mt-1 text-sm text-gray-900">{{ patient.adresse }}</p>
          </div>
        </div>
      </div>

      <!-- Informations système -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations système</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de création</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(patient.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Dernière modification</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(patient.updated_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div class="flex space-x-4">
          <button @click="createAppointment" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <font-awesome-icon icon="calendar-plus" class="mr-2" />
            Nouveau rendez-vous
          </button>
          <button @click="createMedicalRecord" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
            <font-awesome-icon icon="folder-plus" class="mr-2" />
            Nouveau dossier médical
          </button>
          <button @click="deletePatient" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center">
            <font-awesome-icon icon="trash" class="mr-2" />
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6">
      <div class="text-center">
        <font-awesome-icon icon="exclamation-triangle" class="text-yellow-500 text-4xl mb-4" />
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Patient non trouvé</h2>
        <p class="text-gray-600 mb-4">Le patient demandé n'existe pas ou a été supprimé.</p>
        <button @click="goBack" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Retour à la liste
        </button>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <ConfirmModal
      :isVisible="showDeleteModal"
      title="Confirmer la suppression"
      :message="patient ? `Êtes-vous sûr de vouloir supprimer le patient '${patient.firstname} ${patient.lastname}' ? Cette action est irréversible et supprimera également tous ses dossiers médicaux et rendez-vous.` : ''"
      confirmText="Supprimer"
      cancelText="Annuler"
      @confirm="confirmDeletePatient"
      @cancel="cancelDeletePatient"
    />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { patientService } from '../services/patientService'
import type { Patient } from '../types/global'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const patient = ref<Patient | null>(null)

// Modal de confirmation
const showDeleteModal = ref(false)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Patients', path: '/patients' },
  { label: 'Détails', path: '' }
])

// Fonctions utilitaires
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR')
}

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

// Fonctions d'action
const goBack = () => {
  router.push('/patients')
}

const editPatient = () => {
  router.push(`/patients/${patient.value?.uuid}/edit`)
}

const createAppointment = () => {
  router.push(`/appointments/create?patient=${patient.value?.uuid}`)
}

const createMedicalRecord = () => {
  router.push(`/medical-records/create?patient=${patient.value?.uuid}`)
}

const deletePatient = () => {
  showDeleteModal.value = true
}

const confirmDeletePatient = () => {
  if (patient.value) {
    const success = patientService.deletePatient(patient.value.uuid)
    if (success && window.showNotification) {
      window.showNotification('success', 'Patient supprimé', `${patient.value.firstname} ${patient.value.lastname} a été supprimé avec succès`)
      goBack()
    }
  }
  showDeleteModal.value = false
}

const cancelDeletePatient = () => {
  showDeleteModal.value = false
}

// Lifecycle
onMounted(() => {
  const patientUuid = route.params.uuid as string
  if (patientUuid) {
    const foundPatient = patientService.getPatientById(patientUuid)
    if (foundPatient) {
      patient.value = foundPatient
    }
  }
})
</script>
