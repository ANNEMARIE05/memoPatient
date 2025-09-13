<template>
  <Layout :title="isEdit ? 'Modifier un dossier médical' : 'Créer un dossier médical'">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <StepForm
      :title="isEdit ? 'Modifier un dossier médical' : 'Créer un dossier médical'"
      :steps="steps"
      :form="form"
      :is-loading="loading"
      :submit-text="isEdit ? 'Mettre à jour' : 'Créer'"
      @submit="handleSubmit"
      @back="goBack"
    >
      <!-- Étape 1: Sélection des intervenants -->
      <template #step-0="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Patient <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.patient_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez un patient</option>
              <option v-for="patient in patients" :key="patient.uuid" :value="patient.uuid">
                {{ patient.firstname }} {{ patient.lastname }} - {{ patient.uuid }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Médecin <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.medecin_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez un médecin</option>
              <option v-for="user in doctors" :key="user.uuid" :value="user.uuid">
                Dr. {{ user.firstname }} {{ user.lastname }}
              </option>
            </select>
          </div>
        </div>
      </template>

      <!-- Étape 2: Diagnostic et traitement -->
      <template #step-1="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Diagnostic <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.diagnose_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez un diagnostic</option>
              <option v-for="diagnosis in diagnoses" :key="diagnosis.uuid" :value="diagnosis.uuid">
                {{ diagnosis.libelle }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Traitement <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.traitement"
              rows="3"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Décrivez le traitement prescrit..."
            ></textarea>
          </div>
        </div>
      </template>

      <!-- Étape 3: Description et statut -->
      <template #step-2="{ form }">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description / Notes
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Notes supplémentaires sur le dossier médical..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Statut <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.statut"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez le statut</option>
              <option :value="1">Actif</option>
              <option :value="2">Archivé</option>
              <option :value="3">Fermé</option>
            </select>
          </div>
        </div>
      </template>
    </StepForm>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import StepForm from '../components/StepForm.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { medicalFolderService } from '../services/medicalFolderService'
import { patientService } from '../services/patientService'
import { userService } from '../services/userService'
import type { MedicalFolder } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Dossiers médicaux', path: '/medical-records' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const steps = [
  {
    title: 'Sélection des intervenants',
    description: 'Choisissez le patient et le médecin concernés',
    fields: ['patient_uuid', 'medecin_uuid']
  },
  {
    title: 'Diagnostic et traitement',
    description: 'Définissez le diagnostic et le traitement prescrit',
    fields: ['diagnose_uuid', 'traitement']
  },
  {
    title: 'Description et statut',
    description: 'Ajoutez des notes et définissez le statut du dossier',
    fields: ['description', 'statut']
  }
]

const form = ref({
  patient_uuid: '',
  medecin_uuid: '',
  diagnose_uuid: '',
  traitement: '',
  description: '',
  statut: 1
})

const patients = ref(patientService.getAllPatients())
const doctors = ref(userService.getAllUsers().filter(user => user.profil === 'Médecin'))
const diagnoses = ref([
  { uuid: 'DIAG001', libelle: 'Hypertension artérielle' },
  { uuid: 'DIAG002', libelle: 'Diabète type 2' },
  { uuid: 'DIAG003', libelle: 'Asthme' },
  { uuid: 'DIAG004', libelle: 'Grippe' },
  { uuid: 'DIAG005', libelle: 'Rhume' }
])

// Fonction pour retourner en arrière
const goBack = () => {
  router.push('/medical-records')
}

// Charger les données du dossier en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.uuid) {
    const folder = medicalFolderService.getMedicalFolderById(route.params.uuid as string)
    if (folder) {
      form.value = {
        patient_uuid: folder.patient_uuid,
        medecin_uuid: folder.medecin_uuid,
        diagnose_uuid: folder.diagnose_uuid,
        traitement: folder.traitement,
        description: folder.description,
        statut: folder.statut
      }
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isEdit.value && route.params.uuid) {
      // Mode édition
      const updatedFolder = medicalFolderService.updateMedicalFolder(route.params.uuid as string, form.value)
      
      if (updatedFolder) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Dossier médical mis à jour avec succès')
        }
        router.push('/medical-records')
      }
    } else {
      // Mode création
      const newFolder = medicalFolderService.addMedicalFolder({
        ...form.value,
        num_folder: `MF-${Date.now()}`
      })
      
      if (newFolder) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Dossier médical créé avec succès')
        }
        router.push('/medical-records')
      }
    }
  } catch (error) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement')
    }
  } finally {
    loading.value = false
  }
}
</script>
