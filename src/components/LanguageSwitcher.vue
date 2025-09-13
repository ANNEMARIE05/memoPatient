<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <font-awesome-icon icon="globe" class="w-4 h-4" />
      <span>{{ currentLanguage }}</span>
      <font-awesome-icon icon="chevron-down" class="w-3 h-3" />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
    >
      <div class="py-1">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="changeLanguage(lang.code)"
          :class="[
            'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2',
            currentLocale === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          ]"
        >
          <span class="text-lg">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
          <font-awesome-icon
            v-if="currentLocale === lang.code"
            icon="check"
            class="w-4 h-4 ml-auto text-blue-600"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const { locale } = useI18n()

const isOpen = ref(false)

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

const currentLocale = computed(() => locale.value)

const currentLanguage = computed(() => {
  const lang = languages.find(l => l.code === currentLocale.value)
  return lang ? lang.name : 'Français'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const { setLocale } = useI18n()

const changeLanguage = (langCode: string) => {
  setLocale(langCode)
  isOpen.value = false
}

// Fermer le dropdown quand on clique ailleurs
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Récupérer la langue préférée depuis le localStorage
  const savedLanguage = localStorage.getItem('preferred-language')
  if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
