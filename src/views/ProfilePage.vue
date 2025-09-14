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
import { ref, computed, onMounted } from 'vue'

// État du composant
const editMode = ref(false)

// Données du profil utilisateur
const userProfile = ref({
  firstName: 'Administrateur',
  lastName: 'Système',
  email: 'admin@test.com',
  phone1: '06 12 34 56 78',
  phone2: '01 23 45 67 89',
  role: 'admin'
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
