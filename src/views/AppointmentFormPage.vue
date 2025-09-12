<template>
  <Layout :title="isEdit ? 'Modifier un rendez-vous' : 'Créer un rendez-vous'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/appointments" class="hover:text-blue-600">Rendez-vous</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">{{ isEdit ? 'Modifier' : 'Créer' }}</span>
        </nav>
      </div>

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous' }}
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

          <!-- Date et heure -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date du rendez-vous <span class="text-red-500">*</span>
              </label>
              <input
                v-model="appointmentDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Heure du rendez-vous <span class="text-red-500">*</span>
              </label>
              <input
                v-model="appointmentTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Motif -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motif du rendez-vous <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.motif"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez le motif</option>
              <option value="Consultation de routine">Consultation de routine</option>
              <option value="Suivi médical">Suivi médical</option>
              <option value="Consultation urgente">Consultation urgente</option>
              <option value="Contrôle">Contrôle</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Prescription">Prescription</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <!-- Motif personnalisé -->
          <div v-if="form.motif === 'Autre'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motif personnalisé
            </label>
            <input
              v-model="customMotif"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le motif du rendez-vous..."
            />
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
              <option :value="0">En attente</option>
              <option :value="1">Confirmé</option>
              <option :value="2">En cours</option>
              <option :value="3">Annulé</option>
              <option :value="4">Terminé</option>
            </select>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link
              to="/appointments"
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
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import type { Appointment } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

const form = ref({
  patient_uuid: '',
  date_edition: '',
  motif: '',
  statut: 1
})

const appointmentDate = ref('')
const appointmentTime = ref('')
const customMotif = ref('')

const patients = ref(patientService.getAllPatients())

// Mise à jour de la date d'édition quand date et heure changent
const updateDateTime = () => {
  if (appointmentDate.value && appointmentTime.value) {
    const dateTime = new Date(`${appointmentDate.value}T${appointmentTime.value}`)
    form.value.date_edition = dateTime.toISOString()
  }
}

// Charger les données du rendez-vous en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.uuid) {
    const appointment = appointmentService.getAppointmentById(route.params.uuid as string)
    if (appointment) {
      const dateTime = new Date(appointment.date_edition)
      appointmentDate.value = dateTime.toISOString().split('T')[0]
      appointmentTime.value = dateTime.toTimeString().slice(0, 5)
      
      form.value = {
        patient_uuid: appointment.patient_uuid,
        date_edition: appointment.date_edition,
        motif: appointment.motif,
        statut: appointment.statut
      }
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    updateDateTime()
    
    // Utiliser le motif personnalisé si "Autre" est sélectionné
    const finalMotif = form.value.motif === 'Autre' && customMotif.value 
      ? customMotif.value 
      : form.value.motif
    
    const appointmentData = {
      ...form.value,
      motif: finalMotif
    }
    
    if (isEdit.value && route.params.uuid) {
      // Mode édition
      const updatedAppointment = appointmentService.updateAppointment(route.params.uuid as string, appointmentData)
      
      if (updatedAppointment) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Rendez-vous mis à jour avec succès')
        }
        router.push('/appointments')
      }
    } else {
      // Mode création
      const newAppointment = appointmentService.addAppointment(appointmentData)
      
      if (newAppointment) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Rendez-vous créé avec succès')
        }
        router.push('/appointments')
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
