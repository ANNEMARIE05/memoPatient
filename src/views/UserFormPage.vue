<template>
  <Layout :title="isEdit ? 'Modifier un utilisateur' : 'Créer un utilisateur'">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/dashboard" class="hover:text-blue-600">Tableau de bord</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <router-link to="/users" class="hover:text-blue-600">Utilisateurs</router-link>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-gray-900">{{ isEdit ? 'Modifier' : 'Créer' }}</span>
        </nav>
      </div>

      <!-- Formulaire -->
      <div class="bg-white border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Informations personnelles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.firstname"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le prénom"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.lastname"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le nom"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone principal <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.phone1"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone secondaire
              </label>
              <input
                v-model="form.phone2"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="06 98 76 54 32"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Genre <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.genre"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez le genre</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Profil <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.profil"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez le profil</option>
                <option value="Administrateur">Administrateur</option>
                <option value="Médecin">Médecin</option>
                <option value="Secrétaire">Secrétaire</option>
                <option value="Infirmier">Infirmier</option>
              </select>
            </div>

            <div v-if="!isEdit">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                :required="!isEdit"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link
              to="/users"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { userService } from '../services/userService'
import type { User } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.uuid)

const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  phone1: '',
  phone2: '',
  sexe: '',
  genre: '',
  profil: '',
  password: ''
})

// Déterminer le sexe basé sur le genre
const updateSexe = () => {
  form.value.sexe = form.value.genre === 'Masculin' ? 'M' : 'F'
}

// Charger les données de l'utilisateur en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.uuid) {
    const user = userService.getUserById(route.params.uuid as string)
    if (user) {
      form.value = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone1: user.phone1,
        phone2: user.phone2,
        sexe: user.sexe,
        genre: user.genre,
        profil: user.profil,
        password: ''
      }
    }
  }
})

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  
  try {
    updateSexe()
    
    if (isEdit.value && route.params.uuid) {
      // Mode édition
      const updates: Partial<User> = {
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        email: form.value.email,
        phone1: form.value.phone1,
        phone2: form.value.phone2,
        sexe: form.value.sexe,
        genre: form.value.genre,
        profil: form.value.profil
      }
      
      if (form.value.password) {
        updates.password = form.value.password
      }
      
      const updatedUser = userService.updateUser(route.params.uuid as string, updates)
      
      if (updatedUser) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Utilisateur mis à jour avec succès')
        }
        router.push('/users')
      }
    } else {
      // Mode création
      const newUser = userService.addUser({
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        email: form.value.email,
        phone1: form.value.phone1,
        phone2: form.value.phone2,
        sexe: form.value.sexe,
        genre: form.value.genre,
        profil: form.value.profil,
        password: form.value.password,
        otp: '000000'
      })
      
      if (newUser) {
        if (window.showNotification) {
          window.showNotification('success', 'Succès', 'Utilisateur créé avec succès')
        }
        router.push('/users')
      }
    }
  } catch (error) {
    if (window.showNotification) {
      window.showNotification('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement')
    }
  } finally {
    loading.value = false
  }
}
</script>
