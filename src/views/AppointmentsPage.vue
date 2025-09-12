<template>
  <Layout title="Rendez-vous">
        <!-- Actions -->
        <div class="mb-4 flex justify-between items-center">
          <div class="flex space-x-3">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="calendar-plus" class="mr-2" />
              Nouveau rendez-vous
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="relative">
              <input
                type="date"
                class="px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select class="px-3 py-2 border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Tous les rendez-vous</option>
              <option>Confirmés</option>
              <option>En attente</option>
              <option>Annulés</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Rendez-vous aujourd'hui"
            value="12"
            icon="calendar-day"
            icon-color="blue"
          />
          <MetricCard
            title="Cette semaine"
            value="45"
            icon="calendar-week"
            icon-color="green"
          />
          <MetricCard
            title="En attente"
            value="8"
            icon="clock"
            icon-color="orange"
          />
          <MetricCard
            title="Annulés"
            value="3"
            icon="times-circle"
            icon-color="red"
          />
        </div>

        <!-- Table des rendez-vous -->
        <div class="bg-white border-2 border-gray-200 shadow-sm">
          <div class="p-4 border-b-2 border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Liste des rendez-vous</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médecin</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="appointment in appointments" :key="appointment.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ appointment.date }}</p>
                      <p class="text-xs text-gray-500">{{ appointment.time }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3">
                        <font-awesome-icon icon="user" class="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ appointment.patient }}</p>
                        <p class="text-xs text-gray-500">{{ appointment.phone }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ appointment.motif }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ appointment.doctor }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ appointment.duration }}</td>
                  <td class="px-4 py-3">
                    <span :class="getStatusClass(appointment.status)" 
                          class="px-2 py-1 text-xs font-medium">
                      {{ appointment.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
                        <font-awesome-icon icon="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import MetricCard from '../components/MetricCard.vue'

// Données des rendez-vous
const appointments = [
  {
    id: 1,
    date: '15 Déc 2024',
    time: '09:00',
    patient: 'Jean Dupont',
    phone: '+33 6 12 34 56 78',
    motif: 'Consultation générale',
    doctor: 'Dr. Martin',
    duration: '30 min',
    status: 'Confirmé'
  },
  {
    id: 2,
    date: '15 Déc 2024',
    time: '10:30',
    patient: 'Marie Dubois',
    phone: '+33 6 87 65 43 21',
    motif: 'Contrôle',
    doctor: 'Dr. Martin',
    duration: '20 min',
    status: 'En attente'
  },
  {
    id: 3,
    date: '15 Déc 2024',
    time: '14:00',
    patient: 'Pierre Durand',
    phone: '+33 6 11 22 33 44',
    motif: 'Première consultation',
    doctor: 'Dr. Bernard',
    duration: '45 min',
    status: 'Confirmé'
  },
  {
    id: 4,
    date: '16 Déc 2024',
    time: '08:30',
    patient: 'Sophie Martin',
    phone: '+33 6 55 66 77 88',
    motif: 'Suivi traitement',
    doctor: 'Dr. Martin',
    duration: '25 min',
    status: 'Confirmé'
  },
  {
    id: 5,
    date: '16 Déc 2024',
    time: '11:00',
    patient: 'Antoine Leroy',
    phone: '+33 6 99 88 77 66',
    motif: 'Urgence',
    doctor: 'Dr. Bernard',
    duration: '30 min',
    status: 'En attente'
  }
]

// Fonction pour obtenir la classe CSS du statut
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Confirmé':
      return 'bg-green-100 text-green-800'
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800'
    case 'Annulé':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
