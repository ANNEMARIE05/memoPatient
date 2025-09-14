<template>
  <Layout title="Détails du patient">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/patients" class="hover:text-blue-600">Patients</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">Détails</span>
        </nav>
      </div>

      <div v-if="patient">
        <!-- En-tête avec actions -->
        <div class="bg-white border border-gray-200 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  {{ patient.firstname }} {{ patient.lastname }}
                </h2>
                <p class="text-sm text-gray-500">ID: {{ patient.uuid }}</p>
              </div>
              <div class="flex space-x-3">
                <router-link
                  to="/patients"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <font-awesome-icon icon="arrow-left" class="mr-2" />
                  Retour à la liste
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations du patient -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Informations personnelles -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Prénom</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.firstname }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Nom</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.lastname }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Date de naissance</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(patient.birthdate) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Âge</label>
                <p class="mt-1 text-sm text-gray-900">{{ calculateAge(patient.birthdate) }} ans</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Sexe</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.sexe }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Genre</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.genre }}</p>
              </div>
            </div>
          </div>

          <!-- Informations de contact -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Informations de contact</h3>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Téléphone principal</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.phone1 }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Téléphone secondaire</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.phone2 || 'Non renseigné' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Adresse</label>
                <p class="mt-1 text-sm text-gray-900">{{ patient.adresse }}</p>
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
                <label class="block text-sm font-medium text-gray-500">ID du patient</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ patient.uuid }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Date de création</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(patient.created_at) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Dernière modification</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(patient.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="bg-white border border-gray-200 shadow-sm">
        <div class="p-6 text-center">
          <font-awesome-icon icon="exclamation-triangle" class="text-yellow-500 text-4xl mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Patient non trouvé</h2>
          <p class="text-gray-600 mb-4">Le patient demandé n'existe pas ou a été supprimé.</p>
          <router-link
            to="/patients"
            class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Retour à la liste
          </router-link>
        </div>
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
