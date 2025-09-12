<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <font-awesome-icon icon="spinner" class="animate-spin text-4xl text-blue-500 mb-4" />
      <p class="text-gray-600">Vérification de l'authentification...</p>
    </div>
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)

onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (!isAuthenticated) {
    router.push('/login')
  } else {
    loading.value = false
  }
})
</script>
