<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Brand -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-md">
          <font-awesome-icon icon="heart-pulse" class="text-white text-2xl" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Memo Patient</h1>
        <p class="text-gray-600">{{ currentStep === 'login' ? $t('login.subtitle') : $t('login.forgotPassword') }}</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white shadow-md p-8 border border-gray-100 login-card">
        <!-- Login Form -->
        <form v-if="currentStep === 'login'" @submit.prevent="handleLogin" class="space-y-6 login-form">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('forms.email') }}
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
              {{ $t('forms.password') }}
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
              <span class="ml-2 text-sm text-gray-600">{{ $t('login.rememberMe') }}</span>
            </label>
            <button type="button" @click="startForgotPassword" class="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              {{ $t('login.forgotPassword') }}
            </button>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none login-button"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              {{ $t('actions.loading') }}
            </span>
            <span v-else class="flex items-center justify-center">
              <font-awesome-icon icon="sign-in-alt" class="mr-2" />
              {{ $t('login.loginButton') }}
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

        <!-- Forgot Password Form - Step 1: Email -->
        <form v-if="currentStep === 'forgot-email'" @submit.prevent="handleForgotPasswordEmail" class="space-y-6">
          <div class="text-center mb-6">
            <font-awesome-icon icon="key" class="text-blue-500 text-3xl mb-3" />
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Mot de passe oublié</h2>
            <p class="text-gray-600 text-sm">Entrez votre adresse email pour recevoir un code de vérification</p>
          </div>

          <div>
            <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div class="relative">
              <input
                id="forgot-email"
                v-model="forgotPasswordForm.email"
                type="email"
                required
                class="w-full px-4 py-3 pl-12 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="votre@email.com"
              />
              <font-awesome-icon icon="envelope" class="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              Envoi en cours...
            </span>
            <span v-else class="flex items-center justify-center">
              <font-awesome-icon icon="paper-plane" class="mr-2" />
              Envoyer le code
            </span>
          </button>

          <button type="button" @click="backToLogin" class="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm">
            <font-awesome-icon icon="arrow-left" class="mr-2" />
            Retour à la connexion
          </button>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 shadow-sm">
            <div class="flex items-center">
              <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
              {{ error }}
            </div>
          </div>
        </form>

        <!-- Forgot Password Form - Step 2: OTP -->
        <form v-if="currentStep === 'forgot-otp'" @submit.prevent="handleForgotPasswordOTP" class="space-y-6">
          <div class="text-center mb-6">
            <font-awesome-icon icon="shield-alt" class="text-blue-500 text-3xl mb-3" />
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Code de vérification</h2>
            <p class="text-gray-600 text-sm">Entrez le code à 4 chiffres envoyé à {{ forgotPasswordForm.email }}</p>
          </div>

          <div>
            <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
              Code de vérification
            </label>
            <div class="flex justify-center space-x-3">
              <input
                v-for="(digit, index) in otpDigits"
                :key="index"
                :ref="`otp-${index}`"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                class="w-12 h-12 text-center text-xl font-bold border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                @input="handleOTPInput(index, $event)"
                @keydown="handleOTPKeydown(index, $event)"
              />
            </div>
          </div>

          <div class="text-center">
            <button type="button" @click="resendOTP" :disabled="otpResendCooldown > 0" class="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors">
              <font-awesome-icon icon="redo" class="mr-1" />
              Renvoyer le code {{ otpResendCooldown > 0 ? `(${otpResendCooldown}s)` : '' }}
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading || !isOTPComplete"
            class="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              Vérification...
            </span>
            <span v-else class="flex items-center justify-center">
              <font-awesome-icon icon="check" class="mr-2" />
              Vérifier le code
            </span>
          </button>

          <button type="button" @click="backToEmail" class="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm">
            <font-awesome-icon icon="arrow-left" class="mr-2" />
            Changer l'email
          </button>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 shadow-sm">
            <div class="flex items-center">
              <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
              {{ error }}
            </div>
          </div>
        </form>

        <!-- Forgot Password Form - Step 3: New Password -->
        <form v-if="currentStep === 'forgot-password'" @submit.prevent="handleForgotPasswordReset" class="space-y-6">
          <div class="text-center mb-6">
            <font-awesome-icon icon="lock" class="text-blue-500 text-3xl mb-3" />
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Nouveau mot de passe</h2>
            <p class="text-gray-600 text-sm">Créez un nouveau mot de passe sécurisé</p>
          </div>

          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div class="relative">
              <input
                id="new-password"
                v-model="forgotPasswordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="••••••••"
              />
              <font-awesome-icon icon="lock" class="absolute left-4 top-3.5 text-gray-400" />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div class="relative">
              <input
                id="confirm-password"
                v-model="forgotPasswordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="••••••••"
              />
              <font-awesome-icon icon="lock" class="absolute left-4 top-3.5 text-gray-400" />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>

          <!-- Password Strength Indicator -->
          <div v-if="forgotPasswordForm.newPassword" class="space-y-2">
            <div class="text-sm text-gray-600">Force du mot de passe :</div>
            <div class="flex space-x-1">
              <div 
                v-for="i in 4" 
                :key="i"
                :class="[
                  'h-2 flex-1 rounded',
                  i <= passwordStrength ? 'bg-green-500' : 'bg-gray-200'
                ]"
              ></div>
            </div>
            <div class="text-xs text-gray-500">
              {{ passwordStrengthText }}
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !isPasswordValid"
            class="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              Réinitialisation...
            </span>
            <span v-else class="flex items-center justify-center">
              <font-awesome-icon icon="check-circle" class="mr-2" />
              Réinitialiser le mot de passe
            </span>
          </button>

          <button type="button" @click="backToOTP" class="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm">
            <font-awesome-icon icon="arrow-left" class="mr-2" />
            Retour au code
          </button>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 shadow-sm">
            <div class="flex items-center">
              <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
              {{ error }}
            </div>
          </div>
        </form>

        <!-- Demo Credentials -->
        <div v-if="currentStep === 'login'" class="mt-6 p-4 bg-blue-50 border border-blue-200 shadow-sm">
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
import { ref, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Login form
const form = reactive({
  email: '',
  password: ''
})

// Forgot password form
const forgotPasswordForm = reactive({
  email: '',
  newPassword: '',
  confirmPassword: ''
})

// UI state
const currentStep = ref<'login' | 'forgot-email' | 'forgot-otp' | 'forgot-password'>('login')
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

// OTP state
const otpDigits = ref(['', '', '', ''])
const otpResendCooldown = ref(0)
const otpTimer = ref<number | null>(null)

// Computed properties
const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const passwordStrength = computed(() => {
  const password = forgotPasswordForm.newPassword
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  switch (strength) {
    case 0: return 'Très faible'
    case 1: return 'Faible'
    case 2: return 'Moyen'
    case 3: return 'Fort'
    case 4: return 'Très fort'
    default: return ''
  }
})

const isPasswordValid = computed(() => {
  return forgotPasswordForm.newPassword.length >= 8 && 
         forgotPasswordForm.newPassword === forgotPasswordForm.confirmPassword &&
         passwordStrength.value >= 2
})

// Login functions
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

// Forgot password functions
const startForgotPassword = () => {
  currentStep.value = 'forgot-email'
  error.value = ''
  forgotPasswordForm.email = ''
}

const backToLogin = () => {
  currentStep.value = 'login'
  error.value = ''
  resetForgotPasswordForm()
}

const backToEmail = () => {
  currentStep.value = 'forgot-email'
  error.value = ''
}

const backToOTP = () => {
  currentStep.value = 'forgot-otp'
  error.value = ''
}

const handleForgotPasswordEmail = async () => {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, accept any email
    if (forgotPasswordForm.email) {
      currentStep.value = 'forgot-otp'
      startOTPResendCooldown()
      
      // Show success notification
      if (window.showNotification) {
        window.showNotification('success', 'Code envoyé', `Un code de vérification a été envoyé à ${forgotPasswordForm.email}`)
      }
    } else {
      error.value = 'Veuillez entrer une adresse email valide'
    }
  } catch (err) {
    error.value = 'Erreur lors de l\'envoi du code'
  } finally {
    loading.value = false
  }
}

const handleForgotPasswordOTP = async () => {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const otpCode = otpDigits.value.join('')
    
    // For demo purposes, accept any 4-digit code
    if (otpCode.length === 4 && /^\d{4}$/.test(otpCode)) {
      currentStep.value = 'forgot-password'
      
      // Show success notification
      if (window.showNotification) {
        window.showNotification('success', 'Code vérifié', 'Code de vérification correct')
      }
    } else {
      error.value = 'Code de vérification invalide'
    }
  } catch (err) {
    error.value = 'Erreur lors de la vérification du code'
  } finally {
    loading.value = false
  }
}

const handleForgotPasswordReset = async () => {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call to reset password
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, accept any valid password
    if (isPasswordValid.value) {
      // Show success notification
      if (window.showNotification) {
        window.showNotification('success', 'Mot de passe réinitialisé', 'Votre mot de passe a été mis à jour avec succès')
      }
      
      // Reset form and go back to login
      resetForgotPasswordForm()
      currentStep.value = 'login'
    } else {
      error.value = 'Les mots de passe ne correspondent pas ou sont trop faibles'
    }
  } catch (err) {
    error.value = 'Erreur lors de la réinitialisation du mot de passe'
  } finally {
    loading.value = false
  }
}

// OTP functions
const handleOTPInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Only allow digits
  if (!/^\d$/.test(value) && value !== '') {
    target.value = ''
    return
  }
  
  otpDigits.value[index] = value
  
  // Auto-focus next input
  if (value && index < 3) {
    nextTick(() => {
      const nextInput = document.querySelector(`[ref="otp-${index + 1}"]`) as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    })
  }
}

const handleOTPKeydown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    nextTick(() => {
      const prevInput = document.querySelector(`[ref="otp-${index - 1}"]`) as HTMLInputElement
      if (prevInput) {
        prevInput.focus()
      }
    })
  }
}

const resendOTP = async () => {
  if (otpResendCooldown.value > 0) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Simulate API call to resend OTP
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    startOTPResendCooldown()
    
    // Show success notification
    if (window.showNotification) {
      window.showNotification('success', 'Code renvoyé', 'Un nouveau code a été envoyé')
    }
  } catch (err) {
    error.value = 'Erreur lors du renvoi du code'
  } finally {
    loading.value = false
  }
}

const startOTPResendCooldown = () => {
  otpResendCooldown.value = 60
  otpTimer.value = setInterval(() => {
    otpResendCooldown.value--
    if (otpResendCooldown.value <= 0) {
      if (otpTimer.value) {
        clearInterval(otpTimer.value)
        otpTimer.value = null
      }
    }
  }, 1000)
}

const resetForgotPasswordForm = () => {
  forgotPasswordForm.email = ''
  forgotPasswordForm.newPassword = ''
  forgotPasswordForm.confirmPassword = ''
  otpDigits.value = ['', '', '', '']
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
    otpTimer.value = null
  }
  otpResendCooldown.value = 0
}
</script>
