<template>
  <!-- Mobile Menu Button -->
  <button 
    @click="toggleMobileMenu"
    class="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-lg"
  >
    <font-awesome-icon icon="bars" class="text-gray-600 text-lg" />
  </button>

  <!-- Mobile Overlay -->
  <div 
    v-if="showMobileMenu"
    @click="closeMobileMenu"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
  ></div>

  <!-- Sidebar -->
  <div :class="[
    'fixed left-0 top-0 bg-white border-r border-gray-200 h-screen flex flex-col z-40 transition-all duration-300',
    showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    isCollapsed ? 'w-16' : 'w-64'
  ]">
    <!-- Logo -->
    <div class="p-4 border-b border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center" :class="{ 'justify-center': isCollapsed }">
          <div class="w-10 h-10 bg-blue-500 flex items-center justify-center" :class="{ 'mr-0': isCollapsed, 'mr-2': !isCollapsed }">
            <font-awesome-icon icon="heartbeat" class="text-white text-lg" />
          </div>
          <div v-if="!isCollapsed">
            <h1 class="text-lg font-bold text-gray-800">Memo Patient</h1>
            <p class="text-xs text-gray-500 font-medium">Système de gestion</p>
          </div>
        </div>
        <!-- Toggle button for desktop -->
        <div class="flex items-center space-x-1">
          <button 
            @click="toggleCollapse"
            class="hidden md:block text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
            title="Réduire/Étendre la sidebar"
          >
            <font-awesome-icon :icon="isCollapsed ? 'chevron-right' : 'chevron-left'" class="text-sm" />
          </button>
          <!-- Close button for mobile -->
          <button 
            @click="closeMobileMenu"
            class="md:hidden text-gray-500 hover:text-gray-700"
          >
            <font-awesome-icon icon="times" class="text-lg" />
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4">
      <div class="mb-4">
        <!-- Tableau de Bord -->
        <div class="mb-4">
          <ul class="space-y-1">
            <li v-for="item in getMenuItemsBySection('main')" :key="item.name">
              <router-link
                :to="item.path"
                @click="closeMobileMenu"
                :class="[
                  'flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  isActive(item.path) 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed ? 'justify-center' : ''
                ]"
                :title="isCollapsed ? item.name : ''"
              >
                <div                 :class="[
                  'flex items-center justify-center transition-colors duration-200',
                  isActive(item.path) 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200',
                  isCollapsed ? 'w-7 h-7' : 'w-7 h-7'
                ]">
                  <font-awesome-icon :icon="item.icon"                   :class="[
                    'text-xs transition-colors duration-200',
                    isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  ]" />
                </div>
                <span v-if="!isCollapsed" class="flex-1 ml-2">{{ item.name }}</span>
                <span 
                  v-if="item.badge && !isCollapsed" 
                  class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 font-semibold shadow-sm"
                >
                  {{ item.badge }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Gestion des utilisateurs -->
        <div class="mb-4">
          <div>
            <button
              @click="toggleUsersMenu"
                :class="[
                  'w-full flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  isUsersSectionActive() 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed ? 'justify-center' : ''
                ]"
                :title="isCollapsed ? 'Utilisateurs' : ''"
            >
              <div                 :class="[
                  'w-7 h-7 flex items-center justify-center transition-colors duration-200',
                  isUsersSectionActive() 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                <font-awesome-icon icon="users"                 :class="[
                  'text-xs transition-colors duration-200',
                  isUsersSectionActive() 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                ]" />
              </div>
              <span v-if="!isCollapsed" class="flex-1 ml-2 text-left">Utilisateurs</span>
              <font-awesome-icon 
                v-if="!isCollapsed"
                :icon="usersMenuOpen ? 'chevron-up' : 'chevron-down'" 
                :class="[
                  'text-xs transition-colors duration-200',
                  isUsersSectionActive() 
                    ? 'text-blue-500' 
                    : 'text-gray-400'
                ]" 
              />
            </button>
            
            <!-- Sous-menu utilisateurs -->
            <div v-show="usersMenuOpen && !isCollapsed" class="mt-1 ml-6 space-y-1">
              <router-link
                v-for="item in getMenuItemsBySection('users')"
                :key="item.name"
                :to="item.path"
                @click="closeMobileMenu"
                :class="[
                  'flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  isActive(item.path) 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                ]"
              >
                <div :class="[
                  'w-6 h-6 flex items-center justify-center transition-all duration-200',
                  isActive(item.path) 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                  <font-awesome-icon :icon="item.icon"                   :class="[
                    'text-xs transition-colors duration-200',
                    isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  ]" />
                </div>
                <span class="flex-1 ml-2">{{ item.name }}</span>
                <span 
                  v-if="item.badge" 
                  class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 font-semibold shadow-sm"
                >
                  {{ item.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Gestion des messageries -->
        <div class="mb-4">
          <div>
            <button
              @click="toggleMessagingMenu"
                :class="[
                  'w-full flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  isMessagingSectionActive() 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed ? 'justify-center' : ''
                ]"
                :title="isCollapsed ? 'Messageries' : ''"
            >
              <div                 :class="[
                  'w-7 h-7 flex items-center justify-center transition-colors duration-200',
                  isMessagingSectionActive() 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                <font-awesome-icon icon="comment-dots"                 :class="[
                  'text-xs transition-colors duration-200',
                  isMessagingSectionActive() 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                ]" />
              </div>
              <span v-if="!isCollapsed" class="flex-1 ml-2 text-left">Messageries</span>
              <font-awesome-icon 
                v-if="!isCollapsed"
                :icon="messagingMenuOpen ? 'chevron-up' : 'chevron-down'" 
                :class="[
                  'text-xs transition-colors duration-200',
                  isMessagingSectionActive() 
                    ? 'text-blue-500' 
                    : 'text-gray-400'
                ]" 
              />
            </button>
            
            <!-- Sous-menu messageries -->
            <div v-show="messagingMenuOpen && !isCollapsed" class="mt-1 ml-6 space-y-1">
              <router-link
                v-for="item in getMenuItemsBySection('messaging')"
                :key="item.name"
                :to="item.path"
                @click="closeMobileMenu"
                :class="[
                  'flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                ]"
              >
                <div :class="[
                  'w-6 h-6 flex items-center justify-center transition-all duration-200',
                  isActive(item.path) 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                  <font-awesome-icon :icon="item.icon"                   :class="[
                    'text-xs transition-colors duration-200',
                    isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  ]" />
                </div>
                <span class="flex-1 ml-2">{{ item.name }}</span>
                <span 
                  v-if="item.badge" 
                  class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 font-semibold shadow-sm"
                >
                  {{ item.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Gestion des Patients -->
        <div class="mb-4">
          <div>
            <button
              @click="togglePatientsMenu"
                :class="[
                  'w-full flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  isPatientsSectionActive() 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed ? 'justify-center' : ''
                ]"
                :title="isCollapsed ? 'Patients' : ''"
            >
              <div                 :class="[
                  'w-7 h-7 flex items-center justify-center transition-colors duration-200',
                  isPatientsSectionActive() 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                <font-awesome-icon icon="user-friends"                 :class="[
                  'text-xs transition-colors duration-200',
                  isPatientsSectionActive() 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                ]" />
              </div>
              <span v-if="!isCollapsed" class="flex-1 ml-2 text-left">Patients</span>
              <font-awesome-icon 
                v-if="!isCollapsed"
                :icon="patientsMenuOpen ? 'chevron-up' : 'chevron-down'" 
                :class="[
                  'text-xs transition-colors duration-200',
                  isPatientsSectionActive() 
                    ? 'text-blue-500' 
                    : 'text-gray-400'
                ]" 
              />
            </button>
            
            <!-- Sous-menu patients -->
            <div v-show="patientsMenuOpen && !isCollapsed" class="mt-1 ml-6 space-y-1">
              <router-link
                v-for="item in getMenuItemsBySection('patients')"
                :key="item.name"
                :to="item.path"
                @click="closeMobileMenu"
                :class="[
                  'flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                ]"
              >
                <div :class="[
                  'w-6 h-6 flex items-center justify-center transition-all duration-200',
                  isActive(item.path) 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                  <font-awesome-icon :icon="item.icon"                   :class="[
                    'text-xs transition-colors duration-200',
                    isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  ]" />
                </div>
                <span class="flex-1 ml-2">{{ item.name }}</span>
                <span 
                  v-if="item.badge" 
                  class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 font-semibold shadow-sm"
                >
                  {{ item.badge }}
                </span>
              </router-link>
              
            </div>
          </div>
        </div>

        <!-- Gestion des Paramètres -->
        <div class="mb-4">
          <div>
            <button
              @click="toggleParametersMenu"
                :class="[
                  'w-full flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  isParametersSectionActive() 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed ? 'justify-center' : ''
                ]"
                :title="isCollapsed ? 'Paramètres' : ''"
            >
              <div                 :class="[
                  'w-7 h-7 flex items-center justify-center transition-colors duration-200',
                  isParametersSectionActive() 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                <font-awesome-icon icon="cog"                 :class="[
                  'text-xs transition-colors duration-200',
                  isParametersSectionActive() 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                ]" />
              </div>
              <span v-if="!isCollapsed" class="flex-1 ml-2 text-left">Paramètres</span>
              <font-awesome-icon 
                v-if="!isCollapsed"
                :icon="parametersMenuOpen ? 'chevron-up' : 'chevron-down'" 
                :class="[
                  'text-xs transition-colors duration-200',
                  isParametersSectionActive() 
                    ? 'text-blue-500' 
                    : 'text-gray-400'
                ]" 
              />
            </button>
            
            <!-- Sous-menu paramètres -->
            <div v-show="parametersMenuOpen && !isCollapsed" class="mt-1 ml-6 space-y-1">
              <router-link
                v-for="item in getMenuItemsBySection('parameters')"
                :key="item.name"
                :to="item.path"
                @click="closeMobileMenu"
                :class="[
                  'flex items-center px-2 py-2 text-sm font-medium transition-colors duration-200 group',
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                ]"
              >
                <div :class="[
                  'w-6 h-6 flex items-center justify-center transition-all duration-200',
                  isActive(item.path) 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                ]">
                  <font-awesome-icon :icon="item.icon"                   :class="[
                    'text-xs transition-colors duration-200',
                    isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  ]" />
                </div>
                <span class="flex-1 ml-2">{{ item.name }}</span>
                <span 
                  v-if="item.badge" 
                  class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 font-semibold shadow-sm"
                >
                  {{ item.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>



  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const showMobileMenu = ref(false)
const usersMenuOpen = ref(false)
const messagingMenuOpen = ref(false)
const patientsMenuOpen = ref(false)
const parametersMenuOpen = ref(false)
const isCollapsed = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleUsersMenu = () => {
  usersMenuOpen.value = !usersMenuOpen.value
}

const toggleMessagingMenu = () => {
  messagingMenuOpen.value = !messagingMenuOpen.value
}

const togglePatientsMenu = () => {
  patientsMenuOpen.value = !patientsMenuOpen.value
}

const toggleParametersMenu = () => {
  parametersMenuOpen.value = !parametersMenuOpen.value
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  // Fermer tous les sous-menus quand on collapse
  if (isCollapsed.value) {
    usersMenuOpen.value = false
    messagingMenuOpen.value = false
    patientsMenuOpen.value = false
    parametersMenuOpen.value = false
  }
  
  // Émettre l'événement pour informer le Layout
  window.dispatchEvent(new CustomEvent('sidebar-toggle', {
    detail: { collapsed: isCollapsed.value }
  }))
}

const isUsersSectionActive = () => {
  return route.path.startsWith('/users') || route.path.startsWith('/profiles')
}

const isMessagingSectionActive = () => {
  return route.path.startsWith('/appointments') || route.path.startsWith('/message-templates') || route.path.startsWith('/message-history')
}

const isPatientsSectionActive = () => {
  return route.path.startsWith('/patients') || route.path.startsWith('/medical-records')
}

const isParametersSectionActive = () => {
  return route.path.startsWith('/parameters') || route.path.startsWith('/localization') || route.path.startsWith('/message-types')
}


const menuItems = [
  { 
    name: 'Tableau de bord', 
    path: '/dashboard', 
    icon: 'chart-line',
    section: 'main',
    badge: undefined as string | undefined
  },
  { 
    name: 'Utilisateurs', 
    path: '/users', 
    icon: 'users',
    section: 'users',
    badge: undefined as string | undefined
  },
  { 
    name: 'Profils', 
    path: '/profiles', 
    icon: 'user-shield',
    section: 'users',
    badge: undefined as string | undefined
  },
  { 
    name: 'Rendez-vous', 
    path: '/appointments', 
    icon: 'calendar-check',
    section: 'messaging',
    badge: undefined as string | undefined
  },
  { 
    name: 'Modèles de messages', 
    path: '/message-templates', 
    icon: 'comment-dots',
    section: 'messaging',
    badge: undefined as string | undefined
  },
  { 
    name: 'Historiques', 
    path: '/message-history', 
    icon: 'history',
    section: 'messaging',
    badge: undefined as string | undefined
  },
  { 
    name: 'Patients', 
    path: '/patients', 
    icon: 'user-friends',
    section: 'patients',
    badge: undefined as string | undefined
  },
  { 
    name: 'Dossiers des patients', 
    path: '/medical-records', 
    icon: 'file-medical-alt',
    section: 'patients',
    badge: undefined as string | undefined
  },
  { 
    name: 'Localisation', 
    path: '/localization', 
    icon: 'map-marker-alt',
    section: 'parameters',
    badge: undefined as string | undefined
  },
  { 
    name: 'Type de message', 
    path: '/message-types', 
    icon: 'tags',
    section: 'parameters',
    badge: undefined as string | undefined
  }
]

const getMenuItemsBySection = (section: string) => {
  return menuItems.filter(item => item.section === section)
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}


// Ouvrir automatiquement les menus si on est sur une page de la section correspondante
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/users') || newPath.startsWith('/profiles')) {
    usersMenuOpen.value = true
  }
  if (newPath.startsWith('/appointments') || newPath.startsWith('/message-templates') || newPath.startsWith('/message-history')) {
    messagingMenuOpen.value = true
  }
  if (newPath.startsWith('/patients') || newPath.startsWith('/medical-records')) {
    patientsMenuOpen.value = true
  }
  if (newPath.startsWith('/parameters') || newPath.startsWith('/localization') || newPath.startsWith('/message-types')) {
    parametersMenuOpen.value = true
  }
}, { immediate: true })
</script>
