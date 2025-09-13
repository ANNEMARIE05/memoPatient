<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar 
      title="Envoi de SMS" 
      subtitle="Gestion des messages SMS aux patients"
      :action-buttons="navbarActions"
      :notification-count="3"
    />

    <!-- Main Content -->
    <main class="p-6 pt-24">
      <div class="max-w-7xl mx-auto">
        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Main Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Type de message -->
            <div class="bg-white border-2 border-gray-200 shadow-sm">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Type de message</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div 
                    v-for="messageType in messageTypes" 
                    :key="messageType.id"
                    @click="selectedMessageType = messageType.id"
                    :class="[
                      'p-4 border-2 cursor-pointer transition-all duration-200',
                      selectedMessageType === messageType.id 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <h4 class="font-medium text-gray-900">{{ messageType.name }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ messageType.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Destinataires -->
            <div class="bg-white border-2 border-gray-200 shadow-sm">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Destinataires</h3>
                <div class="flex space-x-3">
                  <div class="relative flex-1">
                    <input
                      type="text"
                      placeholder="Rechercher un patient..."
                      class="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <font-awesome-icon icon="search" class="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                  <button class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 font-medium transition-colors">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            <!-- Contenu du message -->
            <div class="bg-white border-2 border-gray-200 shadow-sm">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Contenu du message</h3>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Modèle de message</label>
                  <textarea 
                    v-model="messageContent"
                    rows="6"
                    class="w-full px-3 py-2 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tapez votre message ici..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Statistics and Recent Messages -->
          <div class="space-y-6">
            <!-- Statistiques -->
            <div class="bg-white border-2 border-gray-200 shadow-sm">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Messages envoyés aujourd'hui</span>
                    <span class="text-lg font-semibold text-gray-900">{{ smsStats.totalSent }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Messages ce mois</span>
                    <span class="text-lg font-semibold text-gray-900">{{ smsStats.totalSent * 16 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Taux de livraison</span>
                    <span class="text-lg font-semibold text-green-600">{{ smsStats.deliveryRate }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Messages récents -->
            <div class="bg-white border-2 border-gray-200 shadow-sm">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Messages récents</h3>
                <div class="space-y-4">
                  <div v-for="sms in recentSMS" :key="sms.id" class="border-l-4 border-gray-200 pl-4">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-medium text-gray-900">{{ sms.recipientName }}</h4>
                      <span class="text-xs text-gray-500">{{ sms.time }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ sms.messagePreview }}</p>
                    <div class="flex items-center justify-between">
                      <span :class="getSMSStatusClass(sms.status)" class="text-xs px-2 py-1 font-medium">
                        {{ sms.status }}
                      </span>
                      <span class="text-xs text-gray-500">{{ sms.type }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-between space-x-4">
          <button class="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Annuler
          </button>
          <button @click="sendSMS" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
            Envoyer SMS
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import { smsService, type SMSStats } from '../services/smsService'
import { computed, ref } from 'vue'

// Récupération des statistiques SMS
const smsStats = computed(() => smsService.getSMSStats())

// Variables réactives
const selectedMessageType = ref('rappur-rdv')
const messageContent = ref('')

// Types de messages
const messageTypes = [
  { id: 'rappur-rdv', name: 'Rappel RDV', description: 'Rappel de rendez-vous' },
  { id: 'resultats', name: 'Résultats', description: 'Résultats d\'analyses' },
  { id: 'information', name: 'Information', description: 'Information générale' },
  { id: 'urgence', name: 'Urgence', description: 'Message urgent' }
]

// Messages récents
const recentSMS = [
  {
    id: 1,
    recipientName: 'Jean Dupont',
    messagePreview: 'Bonjour Jean, votre rendez-vous est prévu demain à...',
    status: 'Livré',
    type: 'Rappel RDV',
    time: '12:27'
  },
  {
    id: 2,
    recipientName: 'Marie Martin',
    messagePreview: 'Bonjour Marie, vos résultats d\'analyses sont dispo...',
    status: 'En cours',
    type: 'Résultats',
    time: '11:27'
  }
]

// Actions de la navbar
const navbarActions = [
  {
    label: 'Modèles',
    icon: 'file-alt',
    action: () => {
      if (window.showNotification) {
        window.showNotification('info', 'Modèles', 'Gestion des modèles de SMS')
      }
    },
    type: 'secondary' as const
  },
  {
    label: '+ Envoi groupé',
    icon: 'plus',
    action: () => {
      if (window.showNotification) {
        window.showNotification('info', 'Envoi groupé', 'Envoi de SMS groupé')
      }
    },
    type: 'primary' as const
  }
]

// Fonctions
const getSMSStatusClass = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800'
    case 'En cours':
      return 'bg-yellow-100 text-yellow-800'
    case 'Échec':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const sendSMS = () => {
  if (window.showNotification) {
    window.showNotification('success', 'SMS envoyé', 'SMS envoyé avec succès')
  }
}
</script>
