<template>
  <Layout title="Détails du dossier médical">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/medical-records" class="hover:text-blue-600">Dossiers médicaux</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">Détails</span>
        </nav>
      </div>

      <!-- En-tête avec actions -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                Dossier médical #{{ folder?.num_folder }}
              </h2>
              <p class="text-sm text-gray-500">{{ getPatientName(folder?.patient_uuid) }}</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                :to="`/medical-records/${folder?.uuid}/edit`"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <font-awesome-icon icon="edit" class="mr-2" />
                Modifier
              </router-link>
              <button
                @click="handleDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <font-awesome-icon icon="trash" class="mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du dossier -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations générales</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Numéro de dossier</label>
              <p class="mt-1 text-sm text-gray-900 font-mono">{{ folder?.num_folder }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Patient</label>
              <p class="mt-1 text-sm text-gray-900">{{ getPatientName(folder?.patient_uuid) }}</p>
              <router-link
                :to="`/patients/${folder?.patient_uuid}`"
                class="text-xs text-blue-600 hover:text-blue-800"
              >
                Voir le profil du patient →
              </router-link>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Médecin responsable</label>
              <p class="mt-1 text-sm text-gray-900">{{ getDoctorName(folder?.medecin_uuid) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Diagnostic</label>
              <p class="mt-1 text-sm text-gray-900">{{ getDiagnosisName(folder?.diagnose_uuid) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Statut</label>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(folder?.statut)
              ]">
                {{ getStatusText(folder?.statut) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Traitement et description -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Traitement et description</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Traitement prescrit</label>
              <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ folder?.traitement }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Description / Notes</label>
              <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ folder?.description || 'Aucune description' }}</p>
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
              <label class="block text-sm font-medium text-gray-500">ID du dossier</label>
              <p class="mt-1 text-sm text-gray-900 font-mono">{{ folder?.uuid }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Date de création</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(folder?.created_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Dernière modification</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(folder?.updated_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Créé par</label>
              <p class="mt-1 text-sm text-gray-900">{{ getDoctorName(folder?.created_user) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div 
        class="bg-white p-6 max-w-sm w-full mx-4 shadow-2xl rounded-2xl border border-gray-100"
        @click.stop
      >
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mr-4">
            <font-awesome-icon icon="exclamation-triangle" class="text-red-600 text-2xl" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            <p class="text-sm text-gray-600 mt-1">Cette action est irréversible</p>
          </div>
        </div>
        
        <div class="flex justify-between space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 rounded-xl font-medium shadow-md"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { medicalFolderService } from '../services/medicalFolderService'
import { patientService } from '../services/patientService'
import { userService } from '../services/userService'
import type { MedicalFolder } from '../types/global'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const showDeleteModal = ref(false)

const folder = ref<MedicalFolder | undefined>()

// Charger les données du dossier
onMounted(() => {
  if (route.params.uuid) {
    folder.value = medicalFolderService.getMedicalFolderById(route.params.uuid as string)
    if (!folder.value) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Dossier médical non trouvé')
      }
      router.push('/medical-records')
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

// Obtenir le nom d'un diagnostic
const getDiagnosisName = (diagnosisUuid?: string): string => {
  if (!diagnosisUuid) return 'Non défini'
  const diagnosis = medicalFolderService.getDiagnosisById(diagnosisUuid)
  return diagnosis ? diagnosis.libelle : 'Diagnostic non trouvé'
}

// Obtenir le texte du statut
const getStatusText = (statut?: number): string => {
  return medicalFolderService.getStatusText(statut || 0)
}

// Obtenir la classe CSS du statut
const getStatusClass = (statut?: number): string => {
  return medicalFolderService.getStatusClass(statut || 0)
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

// Gestionnaire de suppression
const handleDelete = () => {
  showDeleteModal.value = true
}

// Confirmer la suppression
const confirmDelete = () => {
  if (folder.value?.uuid) {
    const success = medicalFolderService.deleteMedicalFolder(folder.value.uuid)
    if (success) {
      if (window.showNotification) {
        window.showNotification('success', 'Succès', 'Dossier médical supprimé avec succès')
      }
      router.push('/medical-records')
    } else {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Erreur lors de la suppression')
      }
    }
  }
  showDeleteModal.value = false
}
</script>
