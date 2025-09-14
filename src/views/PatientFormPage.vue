<template>
  <Layout :title="isEditing ? 'Modifier le patient' : 'Nouveau patient'">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <StepForm
      :title="isEditing ? 'Modifier le patient' : 'Nouveau patient'"
      :steps="steps"
      :form="form"
      :is-loading="isLoading"
      :submit-text="isEditing ? 'Modifier' : 'Créer'"
      @submit="savePatient"
      @back="goBack"
    >
      <!-- Étape 1: Informations personnelles -->
      <template #step-0="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input
              v-model="form.firstname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Prénom du patient"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              v-model="form.lastname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Nom du patient"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
            <input
              v-model="form.birthdate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
            <select
              v-model="form.sexe"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
            <select
              v-model="form.genre"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Étape 2: Informations de contact -->
      <template #step-1="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone principal *</label>
            <input
              v-model="form.phone1"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="06 12 34 56 78"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone secondaire</label>
            <input
              v-model="form.phone2"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="06 98 76 54 32"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="patient@email.com"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input
              v-model="form.adresse"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="123 Rue de la Paix, Paris"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <select
              v-model="form.locationId"
              :disabled="isLoadingLocations"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Sélectionner une localisation</option>
              <option 
                v-for="location in locations" 
                :key="location.id" 
                :value="location.id"
              >
                {{ location.name }} ({{ location.type }})
              </option>
            </select>
            <div v-if="isLoadingLocations" class="text-xs text-gray-500 mt-1">
              Chargement des localisations...
            </div>
          </div>
        </div>
      </template>
    </StepForm>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import StepForm from '../components/StepForm.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { patientService } from '../services/patientService'
import { geographicLocationService } from '../services/geographicLocationService'
import type { Patient, GeographicLocation } from '../types/global'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const isEditing = computed(() => !!route.params.uuid)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Patients', path: '/patients' },
  { label: isEditing.value ? 'Modifier' : 'Créer', path: '' }
])

const steps = [
  {
    title: 'Informations personnelles',
    description: 'Saisissez les informations de base du patient',
    fields: ['firstname', 'lastname', 'birthdate', 'sexe', 'genre']
  },
  {
    title: 'Informations de contact',
    description: 'Ajoutez les coordonnées de contact du patient',
    fields: ['phone1', 'phone2', 'email', 'adresse']
  }
]

const form = ref({
  firstname: '',
  lastname: '',
  birthdate: '',
  sexe: '',
  genre: '',
  phone1: '',
  phone2: '',
  email: '',
  adresse: '',
  locationId: ''
})

// Localisations disponibles
const locations = ref<GeographicLocation[]>([])
const isLoadingLocations = ref(false)

// Fonctions
const goBack = () => {
  if (isEditing.value) {
    router.push(`/patients/${route.params.uuid}`)
  } else {
    router.push('/patients')
  }
}

const savePatient = async () => {
  isLoading.value = true
  
  try {
    if (isEditing.value) {
      // Mise à jour
      const patientUuid = route.params.uuid as string
      const updated = patientService.updatePatient(patientUuid, form.value)
      
      if (updated && window.showNotification) {
        window.showNotification('success', 'Patient modifié', `${updated.firstname} ${updated.lastname} a été modifié avec succès`)
        router.push(`/patients/${patientUuid}`)
      }
    } else {
      // Création
      const newPatient = patientService.addPatient(form.value)
      
      if (newPatient && window.showNotification) {
        window.showNotification('success', 'Patient créé', `${newPatient.firstname} ${newPatient.lastname} a été créé avec succès`)
        router.push('/patients')
      }
    }
  } catch (error) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de la sauvegarde')
    }
  } finally {
    isLoading.value = false
  }
}

const loadPatient = () => {
  if (isEditing.value) {
    const patientUuid = route.params.uuid as string
    const patient = patientService.getPatientById(patientUuid)
    
    if (patient) {
      form.value = {
        firstname: patient.firstname,
        lastname: patient.lastname,
        birthdate: patient.birthdate,
        sexe: patient.sexe,
        genre: patient.genre,
        phone1: patient.phone1,
        phone2: patient.phone2,
        email: patient.email,
        adresse: patient.adresse,
        locationId: patient.locationId || ''
      }
    }
  }
}

// Charger les localisations disponibles
const loadLocations = async () => {
  isLoadingLocations.value = true
  try {
    const response = geographicLocationService.getLocations({ page: 1, limit: 1000 })
    locations.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des localisations:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Impossible de charger les localisations')
    }
  } finally {
    isLoadingLocations.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPatient()
  loadLocations()
})
</script>

