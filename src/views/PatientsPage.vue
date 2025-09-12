<template>
  <Layout title="Registre des patients">
        <!-- Actions -->
        <div class="mb-4 flex justify-between items-center">
          <div class="flex space-x-3">
                <button @click="showAddPatientModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="user-plus" class="mr-2" />
              Nouveau patient
            </button>
            <button @click="importPatients" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="upload" class="mr-2" />
              Importer
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="relative">
              <input
                type="text"
                placeholder="Rechercher un patient..."
                class="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <font-awesome-icon icon="search" class="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <select class="px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Tous les patients</option>
              <option>Actifs</option>
              <option>Inactifs</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            :title="'Total patients'"
            :value="patientStats.total.toString()"
            icon="users"
            icon-color="blue"
          />
          <MetricCard
            :title="'Nouveaux ce mois'"
            :value="patientStats.newThisMonth.toString()"
            icon="user-plus"
            icon-color="green"
          />
          <MetricCard
            :title="'Patients actifs'"
            :value="patientStats.active.toString()"
            icon="user-check"
            icon-color="orange"
          />
          <MetricCard
            :title="'Patients inactifs'"
            :value="patientStats.inactive.toString()"
            icon="user-times"
            icon-color="red"
          />
        </div>

        <!-- Table des patients -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Liste des patients</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Âge</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière visite</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="patient in patients" :key="patient.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <font-awesome-icon icon="user" class="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ patient.name }}</p>
                        <p class="text-xs text-gray-500">{{ patient.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ patient.age }} ans</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ patient.phone }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ patient.email }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ patient.lastVisit }}</td>
                  <td class="px-4 py-3">
                    <span :class="patient.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                          class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ patient.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex space-x-2">
                      <button @click="viewPatient(patient)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button @click="editPatient(patient)" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button @click="deletePatient(patient)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
                        <font-awesome-icon icon="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal Ajouter Patient -->
        <div v-if="showAddPatientModal" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div class="bg-white p-6 max-w-2xl w-full mx-4 shadow-lg border-2 border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Nouveau patient</h3>
              <button @click="showAddPatientModal = false" class="text-gray-400 hover:text-gray-600">
                <font-awesome-icon icon="times" class="text-xl" />
              </button>
            </div>
            
            <form @submit.prevent="addPatient" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input v-model="newPatient.name" type="text" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Âge</label>
                  <input v-model="newPatient.age" type="number" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input v-model="newPatient.phone" type="tel" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input v-model="newPatient.email" type="email" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input v-model="newPatient.address" type="text" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              
              <div class="flex space-x-3 pt-4">
                <button type="button" @click="showAddPatientModal = false" class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  Annuler
                </button>
                <button type="submit" class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Modifier Patient -->
        <div v-if="showEditPatientModal && selectedPatient" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div class="bg-white p-6 max-w-2xl w-full mx-4 shadow-lg border-2 border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Modifier patient</h3>
              <button @click="showEditPatientModal = false" class="text-gray-400 hover:text-gray-600">
                <font-awesome-icon icon="times" class="text-xl" />
              </button>
            </div>
            
            <form @submit.prevent="updatePatient" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input v-model="selectedPatient.name" type="text" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Âge</label>
                  <input v-model="selectedPatient.age" type="number" required class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              
              <div class="flex space-x-3 pt-4">
                <button type="button" @click="showEditPatientModal = false" class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  Annuler
                </button>
                <button type="submit" class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium">
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import MetricCard from '../components/MetricCard.vue'
import { patientService, type Patient, type PatientStats } from '../services/patientService'
import { computed, ref } from 'vue'

// Récupération des données des patients
const patients = computed(() => patientService.getAllPatients())
const patientStats = computed(() => patientService.getPatientsStats())

// Variables réactives pour les modales
const showAddPatientModal = ref(false)
const showEditPatientModal = ref(false)
const selectedPatient = ref(null)

// Nouveau patient
const newPatient = ref({
  name: '',
  age: null,
  phone: '',
  email: '',
  address: '',
  gender: 'M',
  dateOfBirth: '',
  medicalHistory: [],
  allergies: [],
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  }
})

// Fonctions CRUD
const viewPatient = (patient) => {
  // Ici on pourrait rediriger vers une page de détails
  if (window.showNotification) {
    window.showNotification('info', 'Détails patient', `Affichage des détails pour ${patient.name}`)
  }
}

const editPatient = (patient) => {
  selectedPatient.value = { ...patient }
  showEditPatientModal.value = true
}

const deletePatient = (patient) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patient.name} ?`)) {
    const success = patientService.deletePatient(patient.id)
    if (success && window.showNotification) {
      window.showNotification('success', 'Patient supprimé', `${patient.name} a été supprimé avec succès`)
    }
  }
}

const addPatient = () => {
  const patientData = {
    ...newPatient.value,
    status: 'Actif',
    lastVisit: new Date().toISOString().split('T')[0]
  }
  
  const newPatientAdded = patientService.addPatient(patientData)
  if (newPatientAdded && window.showNotification) {
    window.showNotification('success', 'Patient ajouté', `${newPatientAdded.name} a été ajouté avec succès`)
  }
  
  // Réinitialiser le formulaire
  newPatient.value = {
    name: '',
    age: null,
    phone: '',
    email: '',
    address: '',
    gender: 'M',
    dateOfBirth: '',
    medicalHistory: [],
    allergies: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  }
  showAddPatientModal.value = false
}

const updatePatient = () => {
  if (selectedPatient.value) {
    const updated = patientService.updatePatient(selectedPatient.value.id, selectedPatient.value)
    if (updated && window.showNotification) {
      window.showNotification('success', 'Patient modifié', `${updated.name} a été modifié avec succès`)
    }
    showEditPatientModal.value = false
  }
}

const exportPatients = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Export', 'Export des patients en cours...')
  }
}

const importPatients = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Import', 'Import des patients en cours...')
  }
}
</script>
