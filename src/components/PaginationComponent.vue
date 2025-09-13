<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <div class="flex items-center justify-between w-full">
      <!-- Informations de pagination -->
      <div class="flex items-center text-sm text-gray-700">
        <span v-if="!loading">
          Affichage de 
          <span class="font-medium">{{ paginationStart }}</span>
          à 
          <span class="font-medium">{{ paginationEnd }}</span>
          sur 
          <span class="font-medium">{{ pagination.total }}</span>
          résultats
        </span>
        <span v-else class="flex items-center">
          <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
          Chargement...
        </span>
      </div>

      <!-- Sélecteur de taille de page -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <label for="pageSize" class="text-sm text-gray-700">Éléments par page:</label>
          <select
            id="pageSize"
            :value="pagination.limit"
            @change="onPageSizeChange"
            :disabled="loading"
            class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <!-- Navigation de pagination -->
        <div class="flex items-center space-x-2">
          <!-- Bouton Précédent -->
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="!pagination.hasPrev || loading"
            :class="[
              'relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-md transition-colors',
              pagination.hasPrev && !loading
                ? 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            ]"
          >
            <font-awesome-icon icon="chevron-left" class="mr-1" />
            Précédent
          </button>

          <!-- Numéros de page -->
          <div class="flex space-x-1">
            <!-- Première page -->
            <button
              v-if="showFirstPage"
              @click="goToPage(1)"
              :disabled="loading"
              :class="getPageButtonClass(1)"
            >
              1
            </button>
            
            <!-- Ellipsis après la première page -->
            <span v-if="showFirstEllipsis" class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
              ...
            </span>

            <!-- Pages du milieu -->
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :disabled="loading"
              :class="getPageButtonClass(page)"
            >
              {{ page }}
            </button>

            <!-- Ellipsis avant la dernière page -->
            <span v-if="showLastEllipsis" class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
              ...
            </span>

            <!-- Dernière page -->
            <button
              v-if="showLastPage"
              @click="goToPage(pagination.totalPages)"
              :disabled="loading"
              :class="getPageButtonClass(pagination.totalPages)"
            >
              {{ pagination.totalPages }}
            </button>
          </div>

          <!-- Bouton Suivant -->
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="!pagination.hasNext || loading"
            :class="[
              'relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-md transition-colors',
              pagination.hasNext && !loading
                ? 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            ]"
          >
            Suivant
            <font-awesome-icon icon="chevron-right" class="ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PaginatedResponse } from '../types/global'

interface Props {
  pagination: PaginatedResponse<any>['pagination']
  loading?: boolean
}

interface Emits {
  (e: 'page-change', page: number): void
  (e: 'page-size-change', pageSize: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})
const emit = defineEmits<Emits>()

// Calcul des indices de début et fin pour l'affichage
const paginationStart = computed(() => {
  return ((props.pagination.page - 1) * props.pagination.limit) + 1
})

const paginationEnd = computed(() => {
  const end = props.pagination.page * props.pagination.limit
  return Math.min(end, props.pagination.total)
})

// Calcul des pages visibles
const visiblePages = computed(() => {
  const current = props.pagination.page
  const total = props.pagination.totalPages
  const delta = 2 // Nombre de pages à afficher de chaque côté de la page courante
  
  if (total <= 7) {
    // Si moins de 7 pages, afficher toutes
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let start = Math.max(2, current - delta)
  let end = Math.min(total - 1, current + delta)
  
  // Ajuster si on est proche du début ou de la fin
  if (current <= delta + 2) {
    end = Math.min(total - 1, 2 * delta + 2)
  }
  
  if (current >= total - delta - 1) {
    start = Math.max(2, total - 2 * delta - 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Conditions d'affichage des ellipsis
const showFirstPage = computed(() => props.pagination.totalPages > 1)
const showLastPage = computed(() => props.pagination.totalPages > 1)
const showFirstEllipsis = computed(() => visiblePages.value[0] > 2)
const showLastEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1] < props.pagination.totalPages - 1)

// Classe CSS pour les boutons de page
const getPageButtonClass = (page: number) => {
  const isActive = page === props.pagination.page
  return [
    'relative inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md transition-colors',
    isActive
      ? 'bg-blue-600 text-white border-blue-600'
      : props.loading
        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
  ]
}

// Fonction pour naviguer vers une page
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.pagination.totalPages && page !== props.pagination.page && !props.loading) {
    emit('page-change', page)
  }
}

// Fonction pour changer la taille de page
const onPageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newPageSize = parseInt(target.value)
  if (newPageSize !== props.pagination.limit && !props.loading) {
    emit('page-size-change', newPageSize)
  }
}
</script>
