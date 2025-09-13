<template>
  <Layout title="Profil">
    <!-- Modale de changement de mot de passe -->
    <ConfirmModal
      :is-visible="showPasswordModal"
      title="Changer le mot de passe"
      :message="passwordMessage"
      confirm-text="Changer le mot de passe"
      cancel-text="Annuler"
      @confirm="confirmPasswordChange"
      @cancel="cancelPasswordChange"
    >
      <template #content>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
            <input 
              v-model="passwordForm.currentPassword"
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez votre mot de passe actuel"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <input 
              v-model="passwordForm.newPassword"
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez votre nouveau mot de passe"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirmez votre nouveau mot de passe"
            />
          </div>
        </div>
      </template>
    </ConfirmModal>

    <div class="max-w-4xl mx-auto">
      <!-- Profil Header -->
      <div class="bg-white border border-gray-200 shadow-sm mb-6">
        <div class="p-6">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="user" class="text-blue-600 text-2xl" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
              <p class="text-gray-600">{{ userProfile.email }}</p>
              <p class="text-sm text-gray-500">Dernière connexion : {{ lastLogin }}</p>
            </div>
            <div class="ml-auto">
              <button 
                @click="toggleEditMode"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors',
                  editMode ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                ]"
              >
                <font-awesome-icon :icon="editMode ? 'times' : 'edit'" class="mr-2" />
                {{ editMode ? 'Annuler' : 'Modifier le profil' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Informations générales</h3>
          </div>
          <div class="p-4">
            <form @submit.prevent="saveProfile" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input 
                    v-model="userProfile.firstName"
                    :disabled="!editMode"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input 
                    v-model="userProfile.lastName"
                    :disabled="!editMode"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  v-model="userProfile.email"
                  :disabled="!editMode"
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone 1</label>
                  <input 
                    v-model="userProfile.phone1"
                    :disabled="!editMode"
                    type="tel" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone 2</label>
                  <input 
                    v-model="userProfile.phone2"
                    :disabled="!editMode"
                    type="tel" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" 
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profil</label>
                <select 
                  v-model="userProfile.role"
                  :disabled="!editMode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="admin">Administrateur</option>
                  <option value="doctor">Médecin</option>
                  <option value="secretary">Secrétaire</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        <!-- Sécurité -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Sécurité</h3>
          </div>
          <div class="p-4">
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Mot de passe</h4>
                    <p class="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
                  </div>
                  <button 
                    @click="openPasswordModal"
                    class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Modifier
                  </button>
                </div>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Authentification à deux facteurs</h4>
                    <p class="text-sm text-gray-500">Non activée</p>
                  </div>
                  <button 
                    class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    disabled
                  >
                    Activer
                  </button>
                </div>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Sessions actives</h4>
                    <p class="text-sm text-gray-500">2 appareils connectés</p>
                  </div>
                  <button 
                    class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    disabled
                  >
                    Gérer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

          <!-- Statistiques -->
          <div class="bg-white border border-gray-200 shadow-sm mt-6">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Statistiques d'activité</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">1,247</div>
                  <div class="text-sm text-gray-600">Patients gérés</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">892</div>
                  <div class="text-sm text-gray-600">Dossiers créés</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">2,156</div>
                  <div class="text-sm text-gray-600">Rendez-vous planifiés</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">1,247</div>
                  <div class="text-sm text-gray-600">SMS envoyés</div>
                </div>
              </div>
            </div>
          </div>

      <!-- Actions -->
      <div v-if="editMode" class="flex justify-between space-x-3 mt-6">
        <button 
          @click="cancelEdit"
          class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button 
          @click="saveProfile"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { ref, computed, onMounted } from 'vue'

// État du composant
const editMode = ref(false)
const showPasswordModal = ref(false)
const passwordMessage = ref('')

// Données du profil utilisateur
const userProfile = ref({
  firstName: 'Administrateur',
  lastName: 'Système',
  email: 'admin@test.com',
  phone1: '06 12 34 56 78',
  phone2: '01 23 45 67 89',
  role: 'admin'
})

// Données du formulaire de changement de mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Données sauvegardées pour annulation
const originalProfile = ref({ ...userProfile.value })

// Calculer la dernière connexion
const lastLogin = computed(() => {
  const now = new Date()
  return `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
})

// Fonction pour basculer le mode édition
const toggleEditMode = () => {
  if (editMode.value) {
    cancelEdit()
  } else {
    editMode.value = true
    originalProfile.value = { ...userProfile.value }
  }
}

// Fonction pour annuler l'édition
const cancelEdit = () => {
  editMode.value = false
  userProfile.value = { ...originalProfile.value }
}

// Fonction pour sauvegarder le profil
const saveProfile = () => {
  // Simuler la sauvegarde
  localStorage.setItem('user', JSON.stringify({
    name: `${userProfile.value.firstName} ${userProfile.value.lastName}`,
    email: userProfile.value.email
  }))
  
  editMode.value = false
  originalProfile.value = { ...userProfile.value }
  
  if (window.showNotification) {
    window.showNotification('success', 'Profil mis à jour', 'Vos informations ont été sauvegardées avec succès')
  }
}

// Fonction pour ouvrir la modale de changement de mot de passe
const openPasswordModal = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordMessage.value = 'Veuillez remplir les champs ci-dessous pour changer votre mot de passe.'
  showPasswordModal.value = true
}

// Fonction pour confirmer le changement de mot de passe
const confirmPasswordChange = () => {
  // Validation
  if (!passwordForm.value.currentPassword) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Veuillez entrer votre mot de passe actuel')
    }
    return
  }
  
  if (!passwordForm.value.newPassword) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Veuillez entrer un nouveau mot de passe')
    }
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Les mots de passe ne correspondent pas')
    }
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Le mot de passe doit contenir au moins 6 caractères')
    }
    return
  }
  
  // Simuler le changement de mot de passe
  showPasswordModal.value = false
  
  if (window.showNotification) {
    window.showNotification('success', 'Mot de passe changé', 'Votre mot de passe a été modifié avec succès')
  }
}

// Fonction pour annuler le changement de mot de passe
const cancelPasswordChange = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// Charger les données utilisateur au montage
onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    // Mettre à jour le profil avec les données existantes
    const nameParts = user.name ? user.name.split(' ') : ['Administrateur', 'Système']
    userProfile.value.firstName = nameParts[0] || 'Administrateur'
    userProfile.value.lastName = nameParts.slice(1).join(' ') || 'Système'
    userProfile.value.email = user.email || 'admin@test.com'
  }
})
</script>
