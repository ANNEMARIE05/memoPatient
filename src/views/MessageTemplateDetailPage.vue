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

      <!-- En-tête -->
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
                to="/message-templates"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <font-awesome-icon icon="arrow-left" class="mr-2" />
                Retour à la liste
              </router-link>
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
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <!-- Informations patient -->
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">firstname</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">lastname</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">fullname</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">birthdate</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">age</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">phone1</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">phone2</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded">
                  <span class="font-mono text-blue-800">email</span>
                </div>
                <div class="bg-blue-50 px-2 py-1 rounded col-span-2 md:col-span-1">
                  <span class="font-mono text-blue-800">adresse</span>
                </div>
                
                <!-- Informations rendez-vous -->
                <div class="bg-green-50 px-2 py-1 rounded">
                  <span class="font-mono text-green-800">date_rdv</span>
                </div>
                <div class="bg-green-50 px-2 py-1 rounded">
                  <span class="font-mono text-green-800">heure_rdv</span>
                </div>
                <div class="bg-green-50 px-2 py-1 rounded">
                  <span class="font-mono text-green-800">date_heure_rdv</span>
                </div>
                <div class="bg-green-50 px-2 py-1 rounded">
                  <span class="font-mono text-green-800">nom_medecin</span>
                </div>
                <div class="bg-green-50 px-2 py-1 rounded">
                  <span class="font-mono text-green-800">nom_clinique</span>
                </div>
                
                <!-- Informations système -->
                <div class="bg-purple-50 px-2 py-1 rounded">
                  <span class="font-mono text-purple-800">date_actuelle</span>
                </div>
                <div class="bg-purple-50 px-2 py-1 rounded">
                  <span class="font-mono text-purple-800">heure_actuelle</span>
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

const template = ref<MessageTemplate | undefined>()

// Charger les données du modèle
onMounted(() => {
  if (route.params.uuid) {
    template.value = messageTemplateService.getTemplateById(route.params.uuid as string) || undefined
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
  
  let preview = template.value.content
  
  // Remplacer toutes les variables par des exemples
  const exampleData: Record<string, string> = {
    firstname: 'Marie',
    lastname: 'Dubois',
    fullname: 'Marie Dubois',
    birthdate: '15/03/1979',
    age: '45 ans',
    sexe: 'F',
    genre: 'Féminin',
    phone1: '06 12 34 56 78',
    phone2: '06 98 76 54 32',
    email: 'marie.dubois@email.com',
    adresse: '123 Rue de la Paix, Paris',
    date_rdv: '15/12/2024',
    heure_rdv: '14h30',
    date_heure_rdv: '15/12/2024 à 14h30',
    nom_medecin: 'Dr. Martin',
    nom_clinique: 'Clinique Memo Patient',
    date_actuelle: new Date().toLocaleDateString('fr-FR'),
    heure_actuelle: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  
  // Remplacer toutes les variables trouvées
  Object.keys(exampleData).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g')
    preview = preview.replace(regex, exampleData[key])
  })
  
  return preview
})


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

</script>
