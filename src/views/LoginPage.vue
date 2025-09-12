<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Brand -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-md">
          <font-awesome-icon icon="heart-pulse" class="text-white text-2xl" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Memo Patient</h1>
        <p class="text-gray-600">Connectez-vous à votre espace</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white shadow-md p-8 border border-gray-100 login-card">
        <form @submit.prevent="handleLogin" class="space-y-6 login-form">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 pl-12 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 login-input shadow-sm"
                placeholder="votre@email.com"
              />
              <font-awesome-icon icon="envelope" class="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 login-input shadow-sm"
                placeholder="••••••••"
              />
              <font-awesome-icon icon="lock" class="absolute left-4 top-3.5 text-gray-400" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm">
              <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none login-button"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              Connexion en cours...
            </span>
            <span v-else class="flex items-center justify-center">
              <font-awesome-icon icon="sign-in-alt" class="mr-2" />
              Se connecter
            </span>
          </button>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 shadow-sm">
            <div class="flex items-center">
              <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
              {{ error }}
            </div>
          </div>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 shadow-sm">
          <p class="text-sm text-blue-800 font-medium mb-2">Compte de démonstration :</p>
          <p class="text-xs text-blue-700">Email: admin@test.com</p>
          <p class="text-xs text-blue-700">Mot de passe: Admin123@</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500">
          © 2024 Memo Patient. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    if (form.email === 'admin@test.com' && form.password === 'Admin123@') {
      // Store auth state (in a real app, you'd use a proper auth store)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify({
        email: form.email,
        name: 'Administrateur'
      }))
      
      // Show success notification
      if (window.showNotification) {
        window.showNotification('success', 'Connexion réussie', 'Bienvenue dans Memo Patient !')
      }
      
      router.push('/dashboard')
    } else {
      error.value = 'Email ou mot de passe incorrect'
      // Show error notification
      if (window.showNotification) {
        window.showNotification('error', 'Erreur de connexion', 'Email ou mot de passe incorrect')
      }
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script>
