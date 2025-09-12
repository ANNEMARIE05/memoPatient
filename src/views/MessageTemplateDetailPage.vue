<template>
  <Layout title="Détails du modèle de message">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/message-templates" class="hover:text-blue-600">Modèles de messages</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">Détails</span>
        </nav>
      </div>

      <!-- En-tête avec actions -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ template?.name }}
              </h2>
              <p class="text-sm text-gray-500">{{ getMessageTypeLabel(template?.messageType) }}</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                :to="`/message-templates/${template?.uuid}/edit`"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <font-awesome-icon icon="edit" class="mr-2" />
                Modifier
              </router-link>
              <button
                @click="handleDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <font-awesome-icon icon="trash" class="mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du modèle -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations générales</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Nom du modèle</label>
              <p class="mt-1 text-sm text-gray-900">{{ template?.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Type de message</label>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getMessageTypeClass(template?.messageType)
              ]">
                {{ getMessageTypeLabel(template?.messageType) }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Description</label>
              <p class="mt-1 text-sm text-gray-900">{{ template?.description || 'Aucune description' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Statut</label>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(template?.status)
              ]">
                {{ getStatusLabel(template?.status) }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">Longueur maximale</label>
              <p class="mt-1 text-sm text-gray-900">{{ template?.maxLength || 160 }} caractères</p>
            </div>
          </div>
        </div>

        <!-- Contenu du message -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Contenu du message</h3>
          </div>
          <div class="p-6">
            <div class="bg-gray-50 border border-gray-300 rounded-md p-4">
              <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ template?.content }}</div>
            </div>
            
            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Variables disponibles</h4>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">{patient_name}</span>
                  <span class="text-blue-600 ml-1">- Nom du patient</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">{appointment_date}</span>
                  <span class="text-blue-600 ml-1">- Date du RDV</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">{appointment_time}</span>
                  <span class="text-blue-600 ml-1">- Heure du RDV</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">{doctor_name}</span>
                  <span class="text-blue-600 ml-1">- Nom du médecin</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded col-span-2">
                  <span class="font-mono text-blue-800">{clinic_name}</span>
                  <span class="text-blue-600 ml-1">- Nom de la clinique</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aperçu avec données d'exemple -->
      <div class="mt-6 bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Aperçu avec données d'exemple</h3>
        </div>
        <div class="p-6">
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div class="text-sm text-blue-900 whitespace-pre-wrap">{{ previewMessage }}</div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Longueur: {{ template?.content?.length || 0 }} caractères
            <span v-if="template?.maxLength && template.content && template.content.length > template.maxLength" class="text-red-500 ml-2">
              (Dépasse la limite de {{ template.maxLength }} caractères)
            </span>
          </div>
        </div>
      </div>

      <!-- Statistiques d'utilisation -->
      <div class="mt-6 bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Statistiques d'utilisation</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ usageStats.totalSent }}</div>
              <div class="text-sm text-gray-500">Messages envoyés</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ usageStats.successRate }}%</div>
              <div class="text-sm text-gray-500">Taux de succès</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ usageStats.thisMonth }}</div>
              <div class="text-sm text-gray-500">Ce mois</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">{{ usageStats.lastUsed }}</div>
              <div class="text-sm text-gray-500">Dernière utilisation</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div 
        class="bg-white p-6 max-w-sm w-full mx-4 shadow-2xl rounded-2xl border border-gray-100"
        @click.stop
      >
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mr-4">
            <font-awesome-icon icon="exclamation-triangle" class="text-red-600 text-2xl" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            <p class="text-sm text-gray-600 mt-1">Cette action est irréversible</p>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 rounded-xl font-medium shadow-md"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { messageTemplateService } from '../services/messageTemplateService'
import type { MessageTemplate } from '../types/global'

const route = useRoute()
const router = useRouter()
const showDeleteModal = ref(false)

const template = ref<MessageTemplate | undefined>()

// Charger les données du modèle
onMounted(() => {
  if (route.params.uuid) {
    template.value = messageTemplateService.getMessageTemplateById(route.params.uuid as string)
    if (!template.value) {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Modèle de message non trouvé')
      }
      router.push('/message-templates')
    }
  }
})

// Aperçu du message avec des données d'exemple
const previewMessage = computed(() => {
  if (!template.value?.content) return ''
  
  return template.value.content
    .replace(/{patient_name}/g, 'Marie Dubois')
    .replace(/{appointment_date}/g, '15/12/2024')
    .replace(/{appointment_time}/g, '14h30')
    .replace(/{doctor_name}/g, 'Dr. Martin')
    .replace(/{clinic_name}/g, 'Clinique Memo Patient')
})

// Statistiques d'utilisation (simulées)
const usageStats = computed(() => ({
  totalSent: 156,
  successRate: 94,
  thisMonth: 23,
  lastUsed: '2 jours'
}))

// Obtenir le label du type de message
const getMessageTypeLabel = (type?: string): string => {
  const labels: Record<string, string> = {
    'rappel': 'Rappel de rendez-vous',
    'confirmation': 'Confirmation',
    'annulation': 'Annulation',
    'information': 'Information générale',
    'urgence': 'Urgence'
  }
  return labels[type || ''] || 'Non défini'
}

// Obtenir la classe CSS du type de message
const getMessageTypeClass = (type?: string): string => {
  const classes: Record<string, string> = {
    'rappel': 'bg-blue-100 text-blue-800',
    'confirmation': 'bg-green-100 text-green-800',
    'annulation': 'bg-red-100 text-red-800',
    'information': 'bg-gray-100 text-gray-800',
    'urgence': 'bg-orange-100 text-orange-800'
  }
  return classes[type || ''] || 'bg-gray-100 text-gray-800'
}

// Obtenir le label du statut
const getStatusLabel = (status?: string): string => {
  const labels: Record<string, string> = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'draft': 'Brouillon'
  }
  return labels[status || ''] || 'Non défini'
}

// Obtenir la classe CSS du statut
const getStatusClass = (status?: string): string => {
  const classes: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800',
    'draft': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status || ''] || 'bg-gray-100 text-gray-800'
}

// Gestionnaire de suppression
const handleDelete = () => {
  showDeleteModal.value = true
}

// Confirmer la suppression
const confirmDelete = () => {
  if (template.value?.uuid) {
    const success = messageTemplateService.deleteMessageTemplate(template.value.uuid)
    if (success) {
      if (window.showNotification) {
        window.showNotification('success', 'Succès', 'Modèle de message supprimé avec succès')
      }
      router.push('/message-templates')
    } else {
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Erreur lors de la suppression')
      }
    }
  }
  showDeleteModal.value = false
}
</script>
