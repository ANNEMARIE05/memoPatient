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

      <!-- Étape 4: Rédaction du message -->
      <template #step-3="{ form }">
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <font-awesome-icon icon="info-circle" class="h-5 w-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Rédaction du message</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p>Rédigez un message de confirmation à envoyer au patient pour l'informer de son rendez-vous.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="grid grid-cols-1 gap-4">
              <!-- Sélection du modèle de message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Modèle de message</label>
                <select 
                  v-model="messageForm.selectedTemplate" 
                  @change="updateMessageFromTemplate" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Sélectionner un modèle (optionnel)</option>
                  <option v-for="template in messageTemplates" :key="template.id" :value="template.id">
                    {{ template.name }}
                  </option>
                </select>
              </div>

              <!-- Type de message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type de message</label>
                <select 
                  v-model="messageForm.messageType" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="Confirmation">Confirmation</option>
                  <option value="Rappel RDV">Rappel RDV</option>
                  <option value="Annulation">Annulation</option>
                  <option value="Report">Report</option>
                  <option value="Personnalisé">Personnalisé</option>
                </select>
              </div>

              <!-- Texte du message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea 
                  v-model="messageForm.messageText"
                  rows="6"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Tapez votre message ici..."
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                  Vous pouvez utiliser des variables comme [nom], [prénom], [téléphone], [email], {{patientName}}, {{appointmentDate}}, {{appointmentTime}}
                </p>
              </div>

              <!-- Aperçu du message -->
              <div v-if="messageForm.messageText" class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Aperçu du message :</h4>
                <div class="bg-white border border-gray-200 rounded-md p-3">
                  <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ messageForm.messageText }}</p>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                  <span v-if="messageForm.messageText.trim()" class="text-green-600">
                    ✓ Message prêt à être envoyé
                  </span>
                  <span v-else class="text-gray-400">
                    Saisissez un message pour l'envoyer
                  </span>
                </div>
                
                <div class="flex gap-3">
                  <button
                    @click="sendMessageOnly"
                    type="button"
                    :disabled="loading || !messageForm.messageText.trim() || !form.patient_uuid"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <font-awesome-icon icon="paper-plane" class="h-4 w-4 mr-2" />
                    {{ loading ? 'Envoi...' : 'Envoyer le message' }}
                  </button>
                </div>
              </div>
            </div>
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
import { smsService, type SMS } from '../services/smsService'
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
  },
  {
    title: 'Rédaction du message',
    description: 'Rédigez un message de confirmation pour le patient',
    fields: ['messageText']
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

// Formulaire de message
const messageForm = ref({
  selectedTemplate: '',
  messageText: '',
  messageType: 'Confirmation'
})

// Récupération des modèles de message
const messageTemplates = computed(() => smsService.getTemplates())


// Fonction pour retourner en arrière
const goBack = () => {
  router.push('/appointments')
}

// Fonction pour mettre à jour le message à partir du modèle
const updateMessageFromTemplate = () => {
  if (messageForm.value.selectedTemplate) {
    const template = smsService.getTemplateById(messageForm.value.selectedTemplate)
    if (template) {
      messageForm.value.messageText = template.content
    }
  }
}

// Fonction pour envoyer uniquement le message
const sendMessageOnly = async () => {
  if (!messageForm.value.messageText.trim()) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Veuillez saisir un message')
    }
    return
  }

  const patient = patients.value.find(p => p.uuid === form.value.patient_uuid)
  if (!patient) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Veuillez sélectionner un patient')
    }
    return
  }

  loading.value = true

  try {
    const smsData: Omit<SMS, 'id' | 'status' | 'sentAt'> = {
      recipientId: patient.uuid,
      recipientName: `${patient.firstname} ${patient.lastname}`,
      recipientPhone: patient.phone1,
      message: messageForm.value.messageText.trim(),
      type: messageForm.value.messageType as 'Rappel RDV' | 'Annulation' | 'Report' | 'Confirmation' | 'Personnalisé',
      templateId: messageForm.value.selectedTemplate || undefined
    }
    
    smsService.sendSMS(smsData)
    
    if (window.showNotification) {
      window.showNotification('success', 'Succès', `Message envoyé à ${patient.firstname} ${patient.lastname} avec succès`)
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'envoi du message')
    }
  } finally {
    loading.value = false
  }
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
    
    const finalAppointmentData = {
      ...form.value,
      motif: finalMotif
    }
    
    let appointmentResult = null
    
    if (isEdit.value && route.params.uuid) {
      // Mode édition
      appointmentResult = appointmentService.updateAppointment(route.params.uuid as string, finalAppointmentData)
    } else {
      // Mode création
      appointmentResult = appointmentService.addAppointment(finalAppointmentData)
    }
    
    if (appointmentResult) {
      // Envoyer le SMS si un message a été saisi
      if (messageForm.value.messageText.trim()) {
        const patient = patients.value.find(p => p.uuid === form.value.patient_uuid)
        if (patient) {
          const smsData: Omit<SMS, 'id' | 'status' | 'sentAt'> = {
            recipientId: patient.uuid,
            recipientName: `${patient.firstname} ${patient.lastname}`,
            recipientPhone: patient.phone1,
            message: messageForm.value.messageText.trim(),
            type: messageForm.value.messageType as 'Rappel RDV' | 'Annulation' | 'Report' | 'Confirmation' | 'Personnalisé',
            templateId: messageForm.value.selectedTemplate || undefined
          }
          
          smsService.sendSMS(smsData)
          
          if (window.showNotification) {
            window.showNotification('success', 'Succès', `Rendez-vous ${isEdit.value ? 'mis à jour' : 'créé'} et SMS envoyé avec succès`)
          }
        }
      } else {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', `Rendez-vous ${isEdit.value ? 'mis à jour' : 'créé'} avec succès`)
        }
      }
      
      router.push('/appointments')
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
