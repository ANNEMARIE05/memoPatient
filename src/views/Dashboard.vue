<template>
  <Layout title="Tableau de bord">
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
        <div class="grid grid-cols-1 gap-4 mb-6">
          <!-- Patients by Gender -->
          <div class="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Patients par genre</h3>
              
              <!-- Donut Chart -->
              <div class="relative w-64 h-64 mx-auto mb-6">
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
                    <font-awesome-icon icon="venus-mars" class="text-gray-400 text-3xl mb-2" />
                    <p class="text-base text-gray-600">Genre</p>
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div class="flex items-center justify-center space-x-8">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
                  <span class="text-base text-gray-600 font-medium">Femmes ({{ Math.round(femalePercentage) }}%)</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span class="text-base text-gray-600 font-medium">Hommes ({{ Math.round(malePercentage) }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Section Activités récentes -->
        <div class="grid grid-cols-1 gap-4 mt-6">
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
        </div>


  </Layout>

</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { patientService } from '../services/patientService'
import type { PatientStats } from '../types/global'
import { smsService, type SMSStats } from '../services/smsService'
import { userService } from '../services/userService'
import { appointmentService } from '../services/appointmentService'
import type { AppointmentStats } from '../types/global'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

</script>
