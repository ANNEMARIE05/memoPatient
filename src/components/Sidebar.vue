<template>
  <div class="fixed left-0 top-0 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 h-screen flex flex-col shadow-lg z-40">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200 bg-white">
      <div class="flex items-center">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-md">
          <font-awesome-icon icon="heartbeat" class="text-white text-xl" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-800">Memo Patient</h1>
          <p class="text-xs text-gray-500 font-medium">Système de gestion</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6">
      <div class="mb-6">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Navigation</p>
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center px-3 py-3 text-sm font-medium transition-all duration-200 group',
                isActive(item.path) 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
              ]"
            >
              <div :class="[
                'w-8 h-8 flex items-center justify-center transition-all duration-200',
                isActive(item.path) 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
              ]">
                <font-awesome-icon :icon="item.icon" :class="[
                  'text-sm transition-all duration-200',
                  isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                ]" />
              </div>
              <span class="flex-1 ml-3">{{ item.name }}</span>
              <span 
                v-if="item.badge" 
                class="ml-auto bg-red-500 text-white text-xs px-2 py-1 font-semibold shadow-sm"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Logout Button -->
    <div class="p-4 border-t border-gray-200 bg-white">
      <button
        @click="showLogoutModal = true"
        class="w-full flex items-center px-3 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
      >
        <div class="w-8 h-8 bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-all duration-200">
          <font-awesome-icon icon="sign-out-alt" class="text-sm text-gray-500 group-hover:text-red-500" />
        </div>
        <span class="font-medium ml-3">Se déconnecter</span>
      </button>
    </div>

    <!-- Logout Confirmation Modal -->
    <div 
      v-if="showLogoutModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click="showLogoutModal = false"
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
            <h3 class="text-xl font-bold text-gray-900">Confirmer la déconnexion</h3>
            <p class="text-sm text-gray-600 mt-1">Êtes-vous sûr de vouloir vous déconnecter ?</p>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="showLogoutModal = false"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
          >
            Annuler
          </button>
          <button
            @click="handleLogout"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 rounded-xl font-medium shadow-md"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const showLogoutModal = ref(false)


const menuItems = [
  { name: 'Tableau de bord', path: '/dashboard', icon: 'chart-line' },
  { name: 'Registre des patients', path: '/patients', icon: 'user-friends' },
  { name: 'Dossiers médicaux', path: '/medical-records', icon: 'file-medical-alt' },
  { name: 'Rendez-vous', path: '/appointments', icon: 'calendar-check' },
  { name: 'Envoi de SMS', path: '/sms', icon: 'comment-dots', badge: '3' },
  { name: 'Profil', path: '/profile', icon: 'user-cog' }
]

const isActive = (path: string) => {
  return route.path === path
}

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  
  // Show logout notification
  if (window.showNotification) {
    window.showNotification('info', 'Déconnexion', 'Vous avez été déconnecté avec succès')
  }
  
  router.push('/login')
}
</script>
