<template>
  <Layout :title="isEdit ? 'Modifier un utilisateur' : 'Créer un utilisateur'">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />
    
    <StepForm
      :title="isEdit ? 'Modifier un utilisateur' : 'Créer un utilisateur'"
      :steps="steps"
      :form="form"
      :is-loading="loading"
      :submit-text="isEdit ? 'Mettre à jour' : 'Créer'"
      @submit="handleSubmit"
      @back="goBack"
    >
      <!-- Étape 1: Informations personnelles -->
      <template #step-0="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Civilité <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.civility"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez la civilité</option>
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prénom <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.firstname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Entrez le prénom"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.lastname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Entrez le nom"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Genre <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.genre"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez le genre</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Étape 2: Informations de contact -->
      <template #step-1="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="exemple@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone principal <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone1"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="06 12 34 56 78"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone secondaire
            </label>
            <input
              v-model="form.phone2"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="06 98 76 54 32"
            />
          </div>
        </div>
      </template>

      <!-- Étape 3: Profil et sécurité -->
      <template #step-2="{ form }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Profil <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.profil"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sélectionnez le profil</option>
              <option value="Administrateur">Administrateur</option>
              <option value="Médecin">Médecin</option>
              <option value="Secrétaire">Secrétaire</option>
              <option value="Infirmier">Infirmier</option>
            </select>
          </div>

          <div v-if="!isEdit">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :required="!isEdit"
                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Mot de passe"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </StepForm>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import StepForm from '../components/StepForm.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { userService } from '../services/userService'
import type { User } from '../types/global'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)

const isEdit = computed(() => !!route.params.uuid)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Utilisateurs', path: '/users' },
  { label: isEdit.value ? 'Modifier' : 'Créer', path: '' }
])

const steps = [
  {
    title: 'Informations personnelles',
    description: 'Saisissez les informations de base de l\'utilisateur',
    fields: ['civility', 'firstname', 'lastname', 'genre']
  },
  {
    title: 'Informations de contact',
    description: 'Ajoutez les coordonnées de contact',
    fields: ['email', 'phone1', 'phone2']
  },
  {
    title: 'Profil et sécurité',
    description: 'Définissez le profil et les paramètres de sécurité',
    fields: ['profil', 'password']
  }
]

const form = ref({
  civility: '',
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

// Fonction pour retourner en arrière
const goBack = () => {
  router.push('/users')
}

// Charger les données de l'utilisateur en mode édition
onMounted(async () => {
  if (isEdit.value && route.params.uuid) {
    const user = userService.getUserById(route.params.uuid as string)
    if (user) {
      form.value = {
        civility: user.civility || '',
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
        civility: form.value.civility,
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
        civility: form.value.civility,
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
