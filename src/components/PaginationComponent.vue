<template>
  <div class="bg-white border-t border-gray-100">
    <!-- Pagination principale -->
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center justify-between w-full">
        <!-- Informations de pagination -->
        <div class="flex items-center text-sm text-gray-600">
          <span v-if="!loading">
            Affichage de 
            <span class="font-semibold text-gray-900">{{ paginationStart }}</span>
            à 
            <span class="font-semibold text-gray-900">{{ paginationEnd }}</span>
            sur 
            <span class="font-semibold text-gray-900">{{ pagination.total }}</span>
            résultats
          </span>
          <span v-else class="flex items-center">
            <font-awesome-icon icon="spinner" class="animate-spin mr-2 text-blue-500" />
            <span class="text-gray-500">Chargement...</span>
          </span>
        </div>

        <!-- Navigation de pagination -->
        <div class="flex items-center space-x-1">
          <!-- Bouton Précédent -->
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="!pagination.hasPrev || loading"
            :class="[
              'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              pagination.hasPrev && !loading
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed'
            ]"
          >
            <font-awesome-icon icon="chevron-left" class="mr-1" />
            Précédent
          </button>

          <!-- Numéros de page -->
          <div class="flex items-center space-x-1">
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
            <span v-if="showFirstEllipsis" class="px-3 py-2 text-sm text-gray-400">
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
            <span v-if="showLastEllipsis" class="px-3 py-2 text-sm text-gray-400">
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
              'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              pagination.hasNext && !loading
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed'
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
    // Si moins de 7 pages, afficher toutes sauf la première et dernière (déjà affichées séparément)
    return Array.from({ length: total - 2 }, (_, i) => i + 2).filter(page => page < total)
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
  
  // S'assurer qu'on n'inclut pas la première ou dernière page
  start = Math.max(2, start)
  end = Math.min(total - 1, end)
  
  if (start > end) {
    return []
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Conditions d'affichage des ellipsis
const showFirstPage = computed(() => props.pagination.totalPages > 1)
const showLastPage = computed(() => props.pagination.totalPages > 1)
const showFirstEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[0] > 2
})
const showLastEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < props.pagination.totalPages - 1
})

// Classe CSS pour les boutons de page
const getPageButtonClass = (page: number) => {
  const isActive = page === props.pagination.page
  return [
    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
    isActive
      ? 'bg-blue-500 text-white shadow-sm'
      : props.loading
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
