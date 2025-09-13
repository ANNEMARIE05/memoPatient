<template>
  <Layout :title="isEdit ? 'Modifier un rendez-vous' : 'Créer un rendez-vous'">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <StepForm
      :title="isEdit ? 'Modifier un rendez-vous' : 'Créer un rendez-vous'"
      :steps="steps"
      :form="form"
      :is-loading="loading"
      :submit-text="isEdit ? 'Mettre à jour' : 'Créer'"
      @submit="handleSubmit"
      @back="goBack"
    >
      <!-- Étape 1: Informations du patient -->
      <template #step-0="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Patient <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.patient_uuid"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Sélectionnez un patient</option>
              <option v-for="patient in patients" :key="patient.uuid" :value="patient.uuid">
                {{ patient.firstname }} {{ patient.lastname }} - {{ patient.uuid }}
              </option>
            </select>
          </div>
        </div>
      </template>

      <!-- Étape 2: Date et heure -->
      <template #step-1="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Date du rendez-vous <span class="text-red-500">*</span>
            </label>
            <input
              v-model="appointmentDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Heure du rendez-vous <span class="text-red-500">*</span>
            </label>
            <input
              v-model="appointmentTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </template>

      <!-- Étape 3: Motif et statut -->
      <template #step-2="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Motif du rendez-vous <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.motif"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Statut <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.statut"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Sélectionnez le statut</option>
              <option :value="0">En attente</option>
              <option :value="1">Confirmé</option>
              <option :value="2">En cours</option>
              <option :value="3">Annulé</option>
              <option :value="4">Terminé</option>
            </select>
          </div>

          <!-- Motif personnalisé -->
          <div v-if="form.motif === 'Autre'" class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Motif personnalisé
            </label>
            <input
              v-model="customMotif"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Décrivez le motif du rendez-vous..."
            />
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
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import type { Appointment } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Rendez-vous', path: '/appointments' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const steps = [
  {
    title: 'Informations du patient',
    description: 'Sélectionnez le patient pour le rendez-vous',
    fields: ['patient_uuid']
  },
  {
    title: 'Date et heure',
    description: 'Définissez la date et l\'heure du rendez-vous',
    fields: ['date_edition']
  },
  {
    title: 'Motif et statut',
    description: 'Précisez le motif et le statut du rendez-vous',
    fields: ['motif', 'statut']
  }
]

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

// Fonction pour retourner en arrière
const goBack = () => {
  router.push('/appointments')
}

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
