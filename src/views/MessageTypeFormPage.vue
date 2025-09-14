<template>
  <Layout :title="isEdit ? 'Modifier le type de message' : 'Nouveau type de message'">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow rounded-lg">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <!-- Titre et description à gauche -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="tags" class="text-blue-600" />
              </div>
              <div>
                <h1 class="text-xl font-semibold text-gray-900">
                  {{ isEdit ? 'Modifier le type de message' : 'Nouveau type de message' }}
                </h1>
                <p class="text-sm text-gray-500">
                  {{ isEdit ? 'Modifiez les informations du type de message' : 'Créez un nouveau type de message' }}
                </p>
              </div>
            </div>
            
            <!-- Actions à droite -->
            <div class="flex items-center space-x-3">
              <button
                @click="goBack"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors"
              >
                <font-awesome-icon icon="arrow-left" class="mr-2" />
                Retour
              </button>
              <button
                @click="handleSubmit"
                :disabled="loading"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm transition-colors"
              >
                <font-awesome-icon v-if="loading" icon="spinner" class="mr-2 animate-spin" />
                {{ loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Libellé <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.libelle"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ex: Rappel RDV"
            />
            <p class="mt-1 text-xs text-gray-500">
              Le libellé doit être unique et descriptif
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              v-model="form.statut"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              Un type inactif ne sera pas disponible dans les listes de sélection
            </p>
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
import Breadcrumb from '../components/Breadcrumb.vue'
import { messageTypeService } from '../services/messageTypeService'
import type { MessageType } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Types de messages', path: '/message-types' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const form = ref({
  libelle: '',
  statut: 'active'
})

// Fonction pour retourner en arrière
const goBack = () => {
  router.push('/message-types')
}

// Charger les données du type de message en mode édition
onMounted(() => {
  if (isEdit.value && route.params.uuid) {
    const messageType = messageTypeService.getMessageTypeById(route.params.uuid as string)
    if (messageType) {
      form.value = {
        libelle: messageType.libelle,
        statut: 'active' // Par défaut actif, on pourrait ajouter un champ statut dans le type
      }
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isEdit.value && route.params.uuid) {
      // Mode édition
      const updated = messageTypeService.updateMessageType(route.params.uuid as string, {
        libelle: form.value.libelle
      })
      
      if (updated) {
        if (window.showNotification) {
          window.showNotification('success', 'Modifié', `Le type ${form.value.libelle} a été modifié avec succès.`)
        }
        router.push('/message-types')
      } else {
        if (window.showNotification) {
          window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de la modification.')
        }
      }
    } else {
      // Mode création
      const newType = messageTypeService.addMessageType({
        libelle: form.value.libelle
      })
      
      if (newType) {
        if (window.showNotification) {
          window.showNotification('success', 'Créé', `Le type ${form.value.libelle} a été créé avec succès.`)
        }
        router.push('/message-types')
      } else {
        if (window.showNotification) {
          window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de la création.')
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement.')
    }
  } finally {
    loading.value = false
  }
}
</script>
