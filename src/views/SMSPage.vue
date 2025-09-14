<template>
  <Layout title="Envoi de SMS">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <StepForm
      title="Envoi de SMS"
      :steps="steps"
      :form="form"
      :is-loading="isLoading"
      submit-text="Envoyer SMS"
      @submit="sendSMS"
      @back="goBack"
    >
      <!-- Étape 1: Planification de l'envoi -->
      <template #step-0="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date d'envoi</label>
            <input 
              v-model="form.sendDate" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Heure d'envoi</label>
            <input 
              v-model="form.sendTime" 
              type="time" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type de message</label>
            <select 
              v-model="form.messageType" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="Personnalisé">Personnalisé</option>
              <option value="Rappel RDV">Rappel RDV</option>
              <option value="Annulation">Annulation</option>
              <option value="Report">Report</option>
              <option value="Confirmation">Confirmation</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Étape 2: Rédaction du message -->
      <template #step-1="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="sm:col-span-2 lg:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Modèle de message</label>
            <select 
              v-model="form.selectedTemplate" 
              @change="updateMessageFromTemplate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-4"
            >
              <option value="">Sélectionner un modèle (optionnel)</option>
              <option v-for="template in messageTemplates" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
          </div>
          <div class="sm:col-span-2 lg:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="form.messageText"
              rows="6"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Tapez votre message ici..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Vous pouvez utiliser des variables comme [nom], [prénom], [téléphone], [email], &#123;&#123;patientName&#125;&#125;, &#123;&#123;appointmentDate&#125;&#125;, &#123;&#123;appointmentTime&#125;&#125;
            </p>
          </div>
        </div>
      </template>

      <!-- Étape 3: Aperçu et confirmation -->
      <template #step-2="{ form }">
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-lg font-medium text-gray-900 mb-4">Aperçu du message</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Date d'envoi :</label>
              <p class="text-sm text-gray-900">
                {{ form.sendDate || 'Immédiat' }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Heure d'envoi :</label>
              <p class="text-sm text-gray-900">
                {{ form.sendTime || 'Immédiat' }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Type de message :</label>
              <p class="text-sm text-gray-900">
                {{ form.messageType }}
              </p>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700">Message :</label>
            <div class="bg-white border border-gray-200 rounded-md p-3 mt-1">
              <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ form.messageText || 'Aucun message saisi' }}</p>
            </div>
          </div>
        </div>
      </template>
    </StepForm>

    <!-- Modal de confirmation de suppression de modèle -->
    <ConfirmModal
      :isVisible="showDeleteTemplateModal"
      title="Confirmer la suppression du modèle"
      :message="templateToDelete ? `Êtes-vous sûr de vouloir supprimer le modèle '${templateToDelete.type}' ? Cette action est irréversible.` : ''"
      confirmText="Supprimer"
      cancelText="Annuler"
      @confirm="confirmDeleteTemplate"
      @cancel="cancelDeleteTemplate"
    />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import StepForm from '../components/StepForm.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { smsService, type SMS, type SMSTemplate } from '../services/smsService'
import { patientService } from '../services/patientService'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Rendez-vous', path: '/appointments' },
  { label: 'Rédaction de message', path: '' }
])

const steps = [
  {
    title: 'Planification',
    description: 'Définissez la date et l\'heure d\'envoi',
    fields: ['sendDate', 'sendTime', 'messageType']
  },
  {
    title: 'Rédaction du message',
    description: 'Rédigez votre message ou sélectionnez un modèle',
    fields: ['selectedTemplate', 'messageText']
  },
  {
    title: 'Aperçu et confirmation',
    description: 'Vérifiez les informations avant l\'envoi',
    fields: []
  }
]

const form = ref({
  selectedTemplate: '',
  messageText: '',
  sendDate: '',
  sendTime: '',
  messageType: 'Personnalisé'
})

// Récupération des données SMS
const messageTemplates = computed(() => smsService.getTemplates())
const patients = computed(() => patientService.getAllPatients())

// Modal de confirmation pour les modèles
const showDeleteTemplateModal = ref(false)
const templateToDelete = ref<SMSTemplate | null>(null)

// Fonctions utilitaires

// Fonction pour mettre à jour le message à partir du modèle
const updateMessageFromTemplate = () => {
  if (form.value.selectedTemplate) {
    const template = smsService.getTemplateById(form.value.selectedTemplate)
    if (template) {
      form.value.messageText = template.content
    }
  }
}

// Fonction pour retourner en arrière
const goBack = () => {
  router.push('/appointments')
}

// Fonction pour envoyer un SMS
const sendSMS = async () => {
  if (!form.value.messageText.trim()) {
    alert('Veuillez saisir un message')
    return
  }

  // Pour l'instant, on utilise le premier patient disponible
  // Dans une vraie application, il faudrait une autre logique pour déterminer le destinataire
  const patient = patients.value[0]
  if (!patient) {
    alert('Aucun patient disponible')
    return
  }

  isLoading.value = true

  try {
    const smsData: Omit<SMS, 'id' | 'status' | 'sentAt'> = {
      recipientId: patient.uuid,
      recipientName: `${patient.firstname} ${patient.lastname}`,
      recipientPhone: patient.phone1,
      message: form.value.messageText.trim(),
      type: form.value.messageType as 'Rappel RDV' | 'Annulation' | 'Report' | 'Confirmation' | 'Personnalisé',
      templateId: form.value.selectedTemplate || undefined
    }

    const newSMS = smsService.sendSMS(smsData)
    
    // Réinitialiser le formulaire
    form.value = {
      selectedTemplate: '',
      messageText: '',
      sendDate: '',
      sendTime: '',
      messageType: 'Personnalisé'
    }
    
    // Afficher une notification
    if (window.showNotification) {
      window.showNotification('success', 'SMS envoyé', `SMS envoyé à ${patient.firstname} ${patient.lastname} avec succès`)
    }
    
    // Rediriger vers la page des rendez-vous
    router.push('/appointments')
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'envoi du SMS')
    }
  } finally {
    isLoading.value = false
  }
}

// Fonctions pour les modèles
const deleteTemplate = (template: SMSTemplate) => {
  templateToDelete.value = template
  showDeleteTemplateModal.value = true
}

const confirmDeleteTemplate = () => {
  if (templateToDelete.value && window.showNotification) {
    window.showNotification('success', 'Modèle supprimé', `Le modèle '${templateToDelete.value.type}' a été supprimé avec succès`)
  }
  showDeleteTemplateModal.value = false
  templateToDelete.value = null
}

const cancelDeleteTemplate = () => {
  showDeleteTemplateModal.value = false
  templateToDelete.value = null
}

// Charger les données du rendez-vous en cours si l'utilisateur vient de la page de rendez-vous
onMounted(() => {
  const pendingAppointment = localStorage.getItem('pendingAppointment')
  if (pendingAppointment) {
    try {
      const appointmentData = JSON.parse(pendingAppointment)
      
      // Pré-remplir la date et l'heure si disponibles
      if (appointmentData.appointmentDate) {
        form.value.sendDate = appointmentData.appointmentDate
      }
      if (appointmentData.appointmentTime) {
        form.value.sendTime = appointmentData.appointmentTime
      }
      
      // Définir le type de message par défaut
      form.value.messageType = 'Confirmation'
      
      // Nettoyer le localStorage
      localStorage.removeItem('pendingAppointment')
    } catch (error) {
      console.error('Erreur lors du chargement des données du rendez-vous:', error)
    }
  }
})
</script>