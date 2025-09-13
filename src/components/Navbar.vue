<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3">
    <div class="flex items-center justify-between">
      <!-- Page Title -->
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <!-- Language Switcher -->
        <LanguageSwitcher />
        
        <!-- Notifications -->
        <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <font-awesome-icon icon="bell" class="text-xl" />
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>

        <!-- User Menu Dropdown -->
        <div class="relative">
          <button 
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div class="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">
              <font-awesome-icon icon="user" class="text-gray-600 text-sm" />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
            <font-awesome-icon 
              :icon="showUserMenu ? 'chevron-up' : 'chevron-down'" 
              class="text-gray-500 text-xs transition-transform"
            />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <button 
                @click="goToProfile"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <font-awesome-icon icon="user-cog" class="mr-3 text-gray-400" />
                Mon Profil
              </button>
              <button 
                @click="changePassword"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <font-awesome-icon icon="key" class="mr-3 text-gray-400" />
                Changer le mot de passe
              </button>
              <button 
                @click="openSettings"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <font-awesome-icon icon="cog" class="mr-3 text-gray-400" />
                Paramètres
              </button>
            </div>

            <!-- Separator -->
            <div class="border-t border-gray-100 my-1"></div>

            <!-- Logout -->
            <div class="py-1">
              <button 
                @click="showLogoutModal = true"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <font-awesome-icon icon="sign-out-alt" class="mr-3 text-red-400" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="actionButtons && actionButtons.length > 0" class="flex space-x-2">
          <button
            v-for="button in actionButtons"
            :key="button.label"
            @click="button.action"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
              button.type === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            ]"
          >
            <font-awesome-icon v-if="button.icon" :icon="button.icon" class="mr-2" />
            <span>{{ button.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="tabs.length > 0" class="mt-4">
      <nav class="flex space-x-8 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="[
            'pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === tab.name
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
          @click="$emit('tab-change', tab.name)"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Modal de confirmation de déconnexion -->
    <ConfirmModal
      :isVisible="showLogoutModal"
      title="Confirmer la déconnexion"
      message="Êtes-vous sûr de vouloir vous déconnecter ?"
      confirmText="Se déconnecter"
      cancelText="Annuler"
      @confirm="confirmLogout"
      @cancel="cancelLogout"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ConfirmModal from './ConfirmModal.vue'

interface Tab {
  name: string
  path?: string
}

interface ActionButton {
  label: string
  icon?: string
  action: () => void
  type?: 'primary' | 'secondary'
}

interface Props {
  title: string
  subtitle?: string
  tabs?: Tab[]
  activeTab?: string
  actionButtons?: ActionButton[]
  notificationCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  activeTab: '',
  actionButtons: () => [],
  notificationCount: 3
})

defineEmits<{
  'tab-change': [tabName: string]
}>()

const router = useRouter()
const showUserMenu = ref(false)
const showLogoutModal = ref(false)

const user = computed(() => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : { name: 'Utilisateur', email: 'user@example.com' }
})

// Fonction pour basculer le menu utilisateur
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Fonction pour fermer le menu en cliquant à l'extérieur
const closeUserMenu = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Fonction pour aller au profil
const goToProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
}

// Fonction pour changer le mot de passe
const changePassword = () => {
  showUserMenu.value = false
  // Rediriger vers la page de profil pour changer le mot de passe
  router.push('/profile')
}

// Fonction pour ouvrir les paramètres
const openSettings = () => {
  showUserMenu.value = false
  if (window.showNotification) {
    window.showNotification('info', 'Paramètres', 'Fonctionnalité à venir')
  }
}

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  showUserMenu.value = false
  showLogoutModal.value = true
}

// Fonction pour confirmer la déconnexion
const confirmLogout = () => {
  showLogoutModal.value = false
  
  // Déconnexion
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  
  if (window.showNotification) {
    window.showNotification('info', 'Déconnexion', 'Vous avez été déconnecté avec succès')
  }
  
  router.push('/login')
}

// Fonction pour annuler la déconnexion
const cancelLogout = () => {
  showLogoutModal.value = false
}

// Écouter les clics à l'extérieur pour fermer le menu
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>
