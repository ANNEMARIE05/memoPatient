<template>
  <Layout title="Dossiers médicaux">
        <!-- Actions -->
        <div class="mb-4 flex justify-between items-center">
          <div class="flex space-x-3">
            <button @click="showAddRecordModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="folder-plus" class="mr-2" />
              Nouveau dossier
            </button>
            <button @click="bulkActions" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors">
              <font-awesome-icon icon="tasks" class="mr-2" />
              Actions groupées
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="relative">
              <input
                type="text"
                placeholder="Rechercher un dossier..."
                class="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <font-awesome-icon icon="search" class="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <select class="px-3 py-2 border border-gray-300 rounded-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Tous les dossiers</option>
              <option>Actifs</option>
              <option>Archivés</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            :title="'Dossiers actifs'"
            :value="recordStats.totalRecords.toString()"
            icon="folder-medical"
            icon-color="blue"
          />
          <MetricCard
            :title="'Consultations'"
            :value="recordStats.consultations.toString()"
            icon="stethoscope"
            icon-color="green"
          />
          <MetricCard
            :title="'Prescriptions'"
            :value="recordStats.prescriptions.toString()"
            icon="pills"
            icon-color="orange"
          />
          <MetricCard
            :title="'Résultats labo'"
            :value="recordStats.labResults.toString()"
            icon="archive"
            icon-color="red"
          />
        </div>

        <!-- Table des dossiers -->
        <div class="bg-white border border-gray-200 shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Liste des dossiers médicaux</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Dossier</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnostic</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traitement</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médecin</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="record in medicalRecords" :key="record.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <span class="text-sm font-medium text-gray-900">{{ record.id }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <font-awesome-icon icon="user" class="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ record.patientName }}</p>
                        <p class="text-xs text-gray-500">{{ record.patientId }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ record.diagnosis || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ record.treatment || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ record.doctor }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ new Date(record.date).toLocaleDateString() }}</td>
                  <td class="px-4 py-3">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                      {{ record.recordType }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex space-x-2">
                      <button @click="viewRecord(record)" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir les détails">
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button @click="editRecord(record)" class="text-green-600 hover:text-green-800 text-sm" title="Modifier">
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button @click="deleteRecord(record)" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">
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
import { medicalRecordService, type MedicalRecord, type MedicalRecordStats } from '../services/medicalRecordService'
import { computed, ref } from 'vue'

// Récupération des données des dossiers médicaux
const medicalRecords = computed(() => medicalRecordService.getAllRecords())
const recordStats = computed(() => medicalRecordService.getRecordsStats())

// Variables réactives
const showAddRecordModal = ref(false)

// Fonctions CRUD
const viewRecord = (record: MedicalRecord) => {
  if (window.showNotification) {
    window.showNotification('info', 'Détails dossier', `Affichage des détails pour ${record.diagnosis}`)
  }
}

const editRecord = (record: MedicalRecord) => {
  if (window.showNotification) {
    window.showNotification('info', 'Modification', `Modification du dossier ${record.diagnosis}`)
  }
}

const deleteRecord = (record: MedicalRecord) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le dossier ${record.diagnosis} ?`)) {
    const success = medicalRecordService.deleteRecord(record.id)
    if (success && window.showNotification) {
      window.showNotification('success', 'Dossier supprimé', `${record.diagnosis} a été supprimé avec succès`)
    }
  }
}

const exportRecords = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Export', 'Export des dossiers en cours...')
  }
}

const bulkActions = () => {
  if (window.showNotification) {
    window.showNotification('info', 'Actions groupées', 'Fonctionnalité d\'actions groupées en cours de développement...')
  }
}
</script>
