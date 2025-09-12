<template>
  <Layout title="Tableau de bord">
    <!-- Modale de confirmation de déconnexion -->
    <ConfirmModal
      :is-visible="showLogoutModal"
      title="Confirmer la déconnexion"
      message="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à nouveau au système."
      confirm-text="Se déconnecter"
      cancel-text="Annuler"
      @confirm="confirmLogout"
      @cancel="cancelLogout"
    />
        <!-- Top Row - Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Patients -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
                  <p class="text-2xl font-bold text-gray-900">{{ patientStats.total }}</p>
                </div>
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <font-awesome-icon icon="users" class="text-purple-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          <!-- Total Users -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Utilisateurs</p>
                  <p class="text-lg md:text-2xl font-bold text-gray-900">{{ userStats.total }}</p>
                </div>
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <font-awesome-icon icon="user-friends" class="text-blue-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          <!-- Appointments Today -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">RDV Aujourd'hui</p>
                  <p class="text-lg md:text-2xl font-bold text-gray-900">{{ appointmentStats.today }}</p>
                </div>
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <font-awesome-icon icon="calendar-check" class="text-green-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          <!-- SMS Delivery Rate -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Taux de livraison SMS</p>
                  <p class="text-lg md:text-2xl font-bold text-gray-900">{{ smsStats.deliveryRate }}%</p>
                </div>
                <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <font-awesome-icon icon="check-circle" class="text-pink-600 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row - Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <!-- Outpatients vs Inpatients Trend -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Tendance Patients externes vs internes</h3>
                <select class="px-3 py-1 border border-gray-300 rounded bg-white text-sm">
                  <option>Afficher par mois</option>
                  <option>Afficher par semaine</option>
                  <option>Afficher par jour</option>
                </select>
              </div>
              
              <!-- Bar Chart -->
              <div class="h-64 flex items-end justify-between space-x-2 mb-4">
                <div v-for="(month, index) in monthlyData" :key="index" class="flex flex-col items-center space-y-2">
                  <div class="flex flex-col space-y-1">
                    <div :style="{ height: `${month.inpatients * 0.7}px` }" class="w-8 bg-teal-500 rounded-t"></div>
                    <div :style="{ height: `${month.outpatients * 0.7}px` }" class="w-8 bg-purple-500 rounded-b"></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ month.label }}</span>
                </div>
              </div>

              <!-- Legend -->
              <div class="flex items-center justify-center space-x-6">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">Patients internes</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">Patients externes</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Patients by Gender -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Patients par genre</h3>
              
              <!-- Donut Chart -->
              <div class="relative w-48 h-48 mx-auto mb-6">
                <svg class="w-full h-full" viewBox="0 0 100 100">
                  <!-- Background Circle -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="8"
                  />
                  
                  <!-- Femmes (Rose) - Premier segment -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ec4899"
                    stroke-width="8"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="femaleOffset"
                    stroke-linecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  
                  <!-- Hommes (Bleu) - Deuxième segment -->
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="8"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="maleOffset"
                    stroke-linecap="round"
                    :transform="`rotate(${-90 + (femalePercentage / 100) * 360} 50 50)`"
                  />
                </svg>
                
                <!-- Center Text -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <font-awesome-icon icon="venus-mars" class="text-gray-400 text-2xl mb-2" />
                    <p class="text-sm text-gray-600">Genre</p>
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div class="flex items-center justify-center space-x-6">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">Femmes ({{ Math.round(femalePercentage) }}%)</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">Hommes ({{ Math.round(malePercentage) }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row - Data Panels -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Time Admitted -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Heure d'admission</h3>
                <select class="px-3 py-1 border border-gray-300 rounded bg-white text-sm">
                  <option>Aujourd'hui</option>
                  <option>Cette semaine</option>
                  <option>Ce mois</option>
                </select>
              </div>
              
              <!-- Line Chart -->
              <div class="h-32 flex items-end justify-between">
                <div v-for="(hour, index) in admissionHours" :key="index" class="flex flex-col items-center">
                  <div class="w-8 bg-orange-500 rounded-t mb-2" :style="{ height: `${hour.value * 0.7}px` }"></div>
                  <span class="text-sm text-gray-600">{{ hour.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Patients By Division -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Patients par division</h3>
              
              <div class="space-y-4">
                <div v-for="division in divisions" :key="division.name" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div :class="division.color" class="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <font-awesome-icon :icon="division.icon" class="text-white text-sm" />
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ division.name }}</span>
                  </div>
                  <span class="text-lg font-bold text-gray-900">{{ division.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendrier -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Calendrier</h3>
              
              <!-- Mini Calendar -->
              <div class="space-y-2">
                <div class="flex justify-between items-center mb-2">
                  <button class="text-gray-500 hover:text-gray-700">
                    <font-awesome-icon icon="chevron-left" class="text-sm" />
                  </button>
                  <span class="text-sm font-medium text-gray-900">Décembre 2024</span>
                  <button class="text-gray-500 hover:text-gray-700">
                    <font-awesome-icon icon="chevron-right" class="text-sm" />
                  </button>
                </div>
                
                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 gap-1 text-sm">
                  <div class="text-center text-gray-500 py-1">L</div>
                  <div class="text-center text-gray-500 py-1">M</div>
                  <div class="text-center text-gray-500 py-1">M</div>
                  <div class="text-center text-gray-500 py-1">J</div>
                  <div class="text-center text-gray-500 py-1">V</div>
                  <div class="text-center text-gray-500 py-1">S</div>
                  <div class="text-center text-gray-500 py-1">D</div>
                  
                  <div v-for="day in calendarDays" :key="day" 
                       :class="[
                         'text-center py-1 cursor-pointer hover:bg-gray-100',
                         day === 15 ? 'bg-blue-500 text-white' : day > 15 ? 'text-gray-400' : 'text-gray-900'
                       ]">
                    {{ day }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Activités récentes et Alertes -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <!-- Activités récentes -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Activités récentes</h3>
            </div>
            <div class="p-4">
              <div class="space-y-4">
                <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
                  <div :class="activity.iconBg" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <font-awesome-icon :icon="activity.icon" :class="activity.iconColor" class="text-sm" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">{{ activity.description }}</p>
                    <p class="text-sm text-gray-500">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Alertes importantes -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Alertes importantes</h3>
            </div>
            <div class="p-4">
              <div class="space-y-4">
                <div v-for="alert in importantAlerts" :key="alert.id" class="flex items-start space-x-2 md:space-x-3">
                  <div :class="alert.type === 'warning' ? 'bg-yellow-100' : alert.type === 'error' ? 'bg-red-100' : 'bg-blue-100'" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <font-awesome-icon :icon="alert.icon" :class="alert.type === 'warning' ? 'text-yellow-600' : alert.type === 'error' ? 'text-red-600' : 'text-blue-600'" class="text-sm" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ alert.title }}</p>
                    <p class="text-sm text-gray-500">{{ alert.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { patientService } from '../services/patientService'
import type { PatientStats } from '../types/global'
import { smsService, type SMSStats } from '../services/smsService'
import { userService } from '../services/userService'
import { appointmentService } from '../services/appointmentService'
import type { AppointmentStats } from '../types/global'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État de la modale de déconnexion
const showLogoutModal = ref(false)

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  
  // Show logout notification
  if (window.showNotification) {
    window.showNotification('info', 'Déconnexion', 'Vous avez été déconnecté avec succès')
  }
  
  router.push('/login')
}

// Fonction pour afficher la modale de déconnexion
const openLogoutModal = () => {
  showLogoutModal.value = true
}

// Fonction pour confirmer la déconnexion
const confirmLogout = () => {
  showLogoutModal.value = false
  handleLogout()
}

// Fonction pour annuler la déconnexion
const cancelLogout = () => {
  showLogoutModal.value = false
}

// Exposer la fonction pour déconnexion directe depuis la sidebar
;(window as any).openLogoutModal = openLogoutModal

// Récupération des statistiques réelles
const patientStats = computed(() => patientService.getPatientsStats())
const smsStats = computed(() => smsService.getSMSStats())
const userStats = computed(() => userService.getUsersStats())
const appointmentStats = computed(() => appointmentService.getAppointmentsStats())

// Calculs pour le graphique par genre
const circumference = 251.2 // 2 * π * 40
const totalGender = computed(() => patientStats.value.genderDistribution.male + patientStats.value.genderDistribution.female)
const femalePercentage = computed(() => totalGender.value > 0 ? (patientStats.value.genderDistribution.female / totalGender.value) * 100 : 0)
const malePercentage = computed(() => totalGender.value > 0 ? (patientStats.value.genderDistribution.male / totalGender.value) * 100 : 0)

const femaleOffset = computed(() => circumference - (femalePercentage.value / 100) * circumference)
const maleOffset = computed(() => circumference - (malePercentage.value / 100) * circumference)

// Données pour le graphique mensuel
const monthlyData = [
  { label: 'Oct 2019', inpatients: 40, outpatients: 80 },
  { label: 'Nov 2019', inpatients: 45, outpatients: 85 },
  { label: 'Dec 2019', inpatients: 50, outpatients: 90 },
  { label: 'Jan 2020', inpatients: 55, outpatients: 95 },
  { label: 'Feb 2020', inpatients: 60, outpatients: 100 },
  { label: 'Mar 2020', inpatients: 65, outpatients: 105 }
]

// Données pour les heures d'admission
const admissionHours = [
  { label: '07h', value: 20 },
  { label: '08h', value: 113 },
  { label: '09h', value: 85 },
  { label: '10h', value: 70 },
  { label: '11h', value: 45 },
  { label: '12h', value: 30 }
]

// Données pour les divisions
const divisions = [
  { name: 'Cardiologie', count: 247, icon: 'heart', color: 'bg-red-500' },
  { name: 'Neurologie', count: 164, icon: 'brain', color: 'bg-blue-500' },
  { name: 'Chirurgie', count: 86, icon: 'cut', color: 'bg-green-500' }
]

// Données pour le graphique mensuel des patients
const monthlyPatients = [20, 35, 45, 60, 70, 80, 75, 85, 90, 95, 100, 95, 110, 105, 120, 115, 130, 125, 140, 135, 150, 145, 160, 155, 170, 165, 180, 175, 190, 185]

// Données du calendrier
const calendarDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

// Activités récentes
const recentActivities = [
  {
    id: 1,
    description: 'Nouveau patient enregistré : Marie Dubois',
    time: 'Il y a 5 minutes',
    icon: 'user-plus',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    description: 'SMS envoyé à Jean Martin pour rappel de RDV',
    time: 'Il y a 15 minutes',
    icon: 'sms',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    description: 'Dossier médical mis à jour pour Sophie Laurent',
    time: 'Il y a 30 minutes',
    icon: 'file-medical',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    description: 'Rendez-vous confirmé avec Pierre Moreau',
    time: 'Il y a 1 heure',
    icon: 'calendar-check',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 5,
    description: 'Analyse de laboratoire reçue pour Claire Bernard',
    time: 'Il y a 2 heures',
    icon: 'vial',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
]

// Alertes importantes
const importantAlerts = [
  {
    id: 1,
    title: 'Stock de médicaments faible',
    description: 'Metformine - Il reste 15 boîtes',
    type: 'warning',
    icon: 'exclamation-triangle'
  },
  {
    id: 2,
    title: 'Rendez-vous en retard',
    description: 'Michel Durand attend depuis 20 minutes',
    type: 'warning',
    icon: 'clock'
  },
  {
    id: 3,
    title: 'Nouvelle mise à jour disponible',
    description: 'Version 2.1.0 disponible',
    type: 'info',
    icon: 'download'
  },
  {
    id: 4,
    title: 'Sauvegarde automatique réussie',
    description: 'Données sauvegardées à 14:30',
    type: 'info',
    icon: 'save'
  }
]
</script>
