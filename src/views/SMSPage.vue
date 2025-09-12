<template>
  <Layout title="Envoi de SMS">
        <!-- Actions -->
        <div class="mb-4 flex justify-between items-center">
          <div class="flex space-x-3">
            <button @click="showQuickSendModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="sms" class="mr-2" />
              Nouveau SMS
            </button>
            <button @click="manageTemplates" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="edit" class="mr-2" />
              Gérer modèles
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="relative">
              <input
                type="text"
                placeholder="Rechercher un SMS..."
                class="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <font-awesome-icon icon="search" class="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <select class="px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Tous les SMS</option>
              <option>Envoyés</option>
              <option>En attente</option>
              <option>Échecs</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            :title="'SMS envoyés'"
            :value="smsStats.totalSent.toString()"
            icon="sms"
            icon-color="blue"
          />
          <MetricCard
            :title="'Modèles disponibles'"
            :value="smsStats.templatesCount.toString()"
            icon="file-alt"
            icon-color="green"
          />
          <MetricCard
            :title="'Taux de livraison'"
            :value="`${smsStats.deliveryRate}%`"
            icon="check-circle"
            icon-color="orange"
          />
          <MetricCard
            :title="'SMS en attente'"
            :value="smsStats.pending.toString()"
            icon="clock"
            icon-color="red"
          />
        </div>

        <!-- Modèles de messages -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Modèles de messages</h3>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div v-for="template in messageTemplates" :key="template.id" class="p-3 bg-gray-50 border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <font-awesome-icon icon="file-alt" class="text-blue-600" />
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1">{{ template.type }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ template.content }}</p>
                   <div class="mt-2 flex space-x-2">
                     <button class="text-blue-600 hover:text-blue-800 text-xs">
                       <font-awesome-icon icon="edit" class="mr-1" />
                       Modifier
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Envoi rapide -->
          <div class="bg-white border border-gray-200 shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Envoi rapide</h3>
            </div>
            <div class="p-4">
              <form class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Destinataire</label>
                  <select v-model="selectedPatient" @change="updateMessageWithRecipient" class="w-full px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Sélectionner un patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                      {{ patient.name }} - {{ patient.phone }}
                    </option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date d'envoi</label>
                    <input 
                      v-model="sendDate" 
                      @change="updateMessageWithRecipient"
                      type="date" 
                      class="w-full px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Heure d'envoi</label>
                    <input 
                      v-model="sendTime" 
                      @change="updateMessageWithRecipient"
                      type="time" 
                      class="w-full px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
                  <select v-model="selectedTemplate" @change="updateMessageFromTemplate" class="w-full px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Sélectionner un modèle</option>
                    <option v-for="template in messageTemplates" :key="template.id" :value="template.id">
                      {{ template.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    v-model="messageText"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tapez votre message ici..."
                  ></textarea>
                </div>
                <button @click="sendSMS" type="button" class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
                  <font-awesome-icon icon="paper-plane" class="mr-2" />
                  Envoyer SMS
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Historique des SMS -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Historique des SMS</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'envoi</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinataire</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="sms in smsHistory" :key="sms.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ formatDate(sms.sentAt) }}</p>
                      <p class="text-xs text-gray-500">{{ formatTime(sms.sentAt) }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3">
                        <font-awesome-icon icon="user" class="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ sms.recipientName }}</p>
                        <p class="text-xs text-gray-500">{{ sms.recipientPhone }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ sms.type }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{{ sms.message }}</td>
                  <td class="px-4 py-3">
                    <span :class="getSMSStatusClass(sms.status)" 
                          class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ sms.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex space-x-2">
                      <button @click="viewSMS(sms)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button @click="resendSMS(sms)" class="text-green-600 hover:text-green-800 text-sm" title="Renvoyer">
                        <font-awesome-icon icon="redo" />
                      </button>
                      <button @click="deleteSMS(sms)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
                        <font-awesome-icon icon="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import MetricCard from '../components/MetricCard.vue'
import { smsService, type SMSStats, type SMS, type SMSTemplate } from '../services/smsService'
import { patientService } from '../services/patientService'
import { computed, ref } from 'vue'

// Récupération des données SMS
const messageTemplates = computed(() => smsService.getTemplates())
const smsHistory = computed(() => smsService.getSMSHistory())
const smsStats = computed(() => smsService.getSMSStats())
const patients = computed(() => patientService.getAllPatients())

// Variables réactives pour le formulaire
const selectedPatient = ref('')
const selectedTemplate = ref('')
const messageText = ref('')
const sendDate = ref('')
const sendTime = ref('')
const showQuickSendModal = ref(false)

const getSMSStatusClass = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800'
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800'
    case 'Échec':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Fonction pour mettre à jour le message à partir du modèle
const updateMessageFromTemplate = () => {
  if (selectedTemplate.value) {
    const template = smsService.getTemplateById(selectedTemplate.value)
    if (template) {
      let message = template.content
      
      // Remplacer les variables si un patient est sélectionné
      if (selectedPatient.value) {
        const patient = patients.value.find(p => p.id === selectedPatient.value)
        if (patient) {
          // Remplacer les variables avec crochets
          message = message.replace(/\[nom\]/g, patient.name)
          message = message.replace(/\[prénom\]/g, patient.name.split(' ')[0])
          message = message.replace(/\[téléphone\]/g, patient.phone)
          message = message.replace(/\[email\]/g, patient.email)
          
          // Remplacer les variables avec accolades doubles
          message = message.replace(/\{\{patientName\}\}/g, patient.name)
          message = message.replace(/\{\{appointmentDate\}\}/g, sendDate.value || 'la date sélectionnée')
          message = message.replace(/\{\{appointmentTime\}\}/g, sendTime.value || 'l\'heure sélectionnée')
        }
      }
      
      messageText.value = message
    }
  }
}

// Fonction pour auto-remplir le message quand un destinataire est sélectionné
const updateMessageWithRecipient = () => {
  if (selectedPatient.value && selectedTemplate.value) {
    updateMessageFromTemplate()
  } else if (selectedPatient.value && messageText.value) {
    // Si un patient est sélectionné mais pas de modèle, on peut personnaliser le message existant
    const patient = patients.value.find(p => p.id === selectedPatient.value)
    if (patient) {
      let message = messageText.value
      // Remplacer les variables avec crochets
      message = message.replace(/\[nom\]/g, patient.name)
      message = message.replace(/\[prénom\]/g, patient.name.split(' ')[0])
      message = message.replace(/\[téléphone\]/g, patient.phone)
      message = message.replace(/\[email\]/g, patient.email)
      
      // Remplacer les variables avec accolades doubles
      message = message.replace(/\{\{patientName\}\}/g, patient.name)
      message = message.replace(/\{\{appointmentDate\}\}/g, sendDate.value || 'la date sélectionnée')
      message = message.replace(/\{\{appointmentTime\}\}/g, sendTime.value || 'l\'heure sélectionnée')
      
      messageText.value = message
    }
  }
}

// Fonction pour envoyer un SMS
const sendSMS = () => {
  if (!selectedPatient.value || !messageText.value.trim()) {
    alert('Veuillez sélectionner un patient et saisir un message')
    return
  }

  const patient = patients.value.find(p => p.id === selectedPatient.value)
  if (!patient) {
    alert('Patient non trouvé')
    return
  }

  const smsData = {
    recipientId: patient.id,
    recipientName: patient.name,
    recipientPhone: patient.phone,
    message: messageText.value.trim(),
    type: selectedTemplate.value ? messageTemplates.value.find(t => t.id === selectedTemplate.value)?.type || 'Personnalisé' : 'Personnalisé',
    templateId: selectedTemplate.value || undefined
  }

  const newSMS = smsService.sendSMS(smsData)
  
  // Réinitialiser le formulaire
  selectedPatient.value = ''
  selectedTemplate.value = ''
  messageText.value = ''
  
  // Afficher une notification
  if (window.showNotification) {
    window.showNotification('success', 'SMS envoyé', `SMS envoyé à ${patient.name} avec succès`)
  }
}

// Fonctions supplémentaires
const viewSMS = (sms) => {
  if (window.showNotification) {
    window.showNotification('info', 'Détails SMS', `Affichage des détails pour ${sms.recipientName}`)
  }
}

const resendSMS = (sms) => {
  const success = smsService.resendSMS(sms.id)
  if (success && window.showNotification) {
    window.showNotification('info', 'SMS renvoyé', `SMS renvoyé à ${sms.recipientName}`)
  }
}

const deleteSMS = (sms) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ce SMS ?`)) {
    if (window.showNotification) {
      window.showNotification('success', 'SMS supprimé', `SMS supprimé avec succès`)
    }
  }
}

// Fonctions pour formater la date et l'heure
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const exportSMS = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Export', 'Export des SMS en cours...')
  }
}

const manageTemplates = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Gestion modèles', 'Gestion des modèles de SMS...')
  }
}
</script>
