<template>
  <Layout title="Profil">

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
              <!-- Le bouton de modification est maintenant dans la section Informations générales -->
            </div>
          </div>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informations générales -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Informations générales</h3>
            <div class="flex space-x-2">
              <button 
                @click="toggleEditMode"
                :class="[
                  'px-3 py-1 text-sm font-medium transition-colors rounded-md',
                  editMode ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                ]"
              >
                <font-awesome-icon :icon="editMode ? 'times' : 'edit'" class="mr-1" />
                {{ editMode ? 'Annuler' : 'Modifier' }}
              </button>
              <button 
                v-if="editMode"
                @click="saveProfile"
                class="px-3 py-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors rounded-md"
              >
                <font-awesome-icon icon="save" class="mr-1" />
                Sauvegarder
              </button>
            </div>
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

        <!-- Mot de passe -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Mot de passe</h3>
            <div class="flex space-x-2">
              <button 
                @click="togglePasswordEditMode"
                :class="[
                  'px-3 py-1 text-sm font-medium transition-colors rounded-md',
                  passwordEditMode ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                ]"
              >
                <font-awesome-icon :icon="passwordEditMode ? 'times' : 'key'" class="mr-1" />
                {{ passwordEditMode ? 'Annuler' : 'Modifier' }}
              </button>
              <button 
                v-if="passwordEditMode"
                @click="savePassword"
                class="px-3 py-1 text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors rounded-md"
              >
                <font-awesome-icon icon="save" class="mr-1" />
                Sauvegarder
              </button>
            </div>
          </div>
          <div class="p-4">
            <form @submit.prevent="savePassword" class="space-y-4">
              <div v-if="!passwordEditMode">
                <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <div class="relative">
                  <input 
                    :type="showCurrentPassword ? 'text' : 'password'"
                    :value="showCurrentPassword ? userProfile.currentPassword : '••••••••'"
                    disabled
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" 
                  />
                  <button 
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <font-awesome-icon :icon="showCurrentPassword ? 'eye-slash' : 'eye'" class="text-sm" />
                  </button>
                </div>
              </div>
              
              <div v-if="passwordEditMode">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.currentPassword"
                      :type="showCurrentPasswordEdit ? 'text' : 'password'"
                      required
                      class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                    />
                    <button 
                      type="button"
                      @click="showCurrentPasswordEdit = !showCurrentPasswordEdit"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <font-awesome-icon :icon="showCurrentPasswordEdit ? 'eye-slash' : 'eye'" class="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      required
                      minlength="6"
                      class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                    />
                    <button 
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" class="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      required
                      class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                    />
                    <button 
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div v-if="passwordError" class="text-red-600 text-sm">
                  {{ passwordError }}
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>



    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { ref, computed, onMounted } from 'vue'

// État du composant
const editMode = ref(false)
const passwordEditMode = ref(false)
const passwordError = ref('')

// États pour l'affichage des mots de passe
const showCurrentPassword = ref(false)
const showCurrentPasswordEdit = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Formulaire de modification du mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Données du profil utilisateur
const userProfile = ref({
  firstName: 'Administrateur',
  lastName: 'Système',
  email: 'admin@test.com',
  phone1: '06 12 34 56 78',
  phone2: '01 23 45 67 89',
  role: 'admin',
  currentPassword: 'motdepasse123' // Mot de passe actuel pour la démonstration
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

// Fonction pour basculer le mode édition du mot de passe
const togglePasswordEditMode = () => {
  if (passwordEditMode.value) {
    cancelPasswordEdit()
  } else {
    passwordEditMode.value = true
    passwordError.value = ''
  }
}

// Fonction pour annuler l'édition du mot de passe
const cancelPasswordEdit = () => {
  passwordEditMode.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  // Réinitialiser les états d'affichage des mots de passe
  showCurrentPasswordEdit.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// Fonction pour sauvegarder le mot de passe
const savePassword = () => {
  passwordError.value = ''
  
  // Validation
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  // Simuler la modification du mot de passe
  // En réalité, ici vous feriez un appel API
  console.log('Changement de mot de passe:', {
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword
  })
  
  // Réinitialiser le formulaire et fermer le mode édition
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordEditMode.value = false
  
  // Réinitialiser les états d'affichage des mots de passe
  showCurrentPasswordEdit.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  
  if (window.showNotification) {
    window.showNotification('success', 'Mot de passe modifié', 'Votre mot de passe a été modifié avec succès')
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
