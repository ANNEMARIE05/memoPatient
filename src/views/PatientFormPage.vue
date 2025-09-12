<template>
  <Layout :title="isEditing ? 'Modifier le patient' : 'Nouveau patient'">
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="savePatient" class="space-y-6">
        <!-- En-tête -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Modifier le patient' : 'Nouveau patient' }}
            </h1>
            <button @click="goBack" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
              <font-awesome-icon icon="arrow-left" class="mr-2" />
              Retour
            </button>
          </div>
        </div>

        <!-- Informations personnelles -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input
                v-model="form.firstname"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Prénom du patient"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                v-model="form.lastname"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom du patient"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
              <input
                v-model="form.birthdate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sexe *</label>
              <select
                v-model="form.sexe"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
              <select
                v-model="form.genre"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Informations de contact -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone principal *</label>
              <input
                v-model="form.phone1"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone secondaire</label>
              <input
                v-model="form.phone2"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="06 98 76 54 32"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="patient@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
              <input
                v-model="form.adresse"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Rue de la Paix, Paris"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-end space-x-4">
            <button @click="goBack" type="button" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" :disabled="isLoading" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
              <font-awesome-icon v-if="isLoading" icon="spinner" class="mr-2 animate-spin" />
              {{ isEditing ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { patientService } from '../services/patientService'
import type { Patient } from '../types/global'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const isEditing = computed(() => !!route.params.uuid)

const form = ref({
  firstname: '',
  lastname: '',
  birthdate: '',
  sexe: '',
  genre: '',
  phone1: '',
  phone2: '',
  email: '',
  adresse: ''
})

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
        adresse: patient.adresse
      }
    }
  }
}

// Lifecycle
onMounted(() => {
  loadPatient()
})
</script>
