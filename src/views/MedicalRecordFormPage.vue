<template>
  <Layout :title="isEdit ? 'Modifier un dossier médical' : 'Créer un dossier médical'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/medical-records" class="hover:text-blue-600">Dossiers médicaux</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">{{ isEdit ? 'Modifier' : 'Créer' }}</span>
        </nav>
      </div>

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier le dossier médical' : 'Nouveau dossier médical' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Sélection du patient -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Patient <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.patient_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un patient</option>
              <option v-for="patient in patients" :key="patient.uuid" :value="patient.uuid">
                {{ patient.firstname }} {{ patient.lastname }} - {{ patient.uuid }}
              </option>
            </select>
          </div>

          <!-- Sélection du médecin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Médecin <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.medecin_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un médecin</option>
              <option v-for="user in doctors" :key="user.uuid" :value="user.uuid">
                Dr. {{ user.firstname }} {{ user.lastname }}
              </option>
            </select>
          </div>

          <!-- Sélection du diagnostic -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Diagnostic <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.diagnose_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un diagnostic</option>
              <option v-for="diagnosis in diagnoses" :key="diagnosis.uuid" :value="diagnosis.uuid">
                {{ diagnosis.libelle }}
              </option>
            </select>
          </div>

          <!-- Traitement -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Traitement <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.traitement"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le traitement prescrit..."
            ></textarea>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description / Notes
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notes supplémentaires sur le dossier médical..."
            ></textarea>
          </div>

          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Statut <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.statut"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez le statut</option>
              <option :value="1">Actif</option>
              <option :value="2">Archivé</option>
              <option :value="3">Fermé</option>
            </select>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link
              to="/medical-records"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { medicalFolderService } from '../services/medicalFolderService'
import { patientService } from '../services/patientService'
import { userService } from '../services/userService'
import type { MedicalFolder } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

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
      const newFolder = medicalFolderService.addMedicalFolder(form.value)
      
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
