/**
 * Template générique pour les pages de tableaux avec pagination SSR
 * Ce fichier contient les fonctions communes utilisées par toutes les pages de tableaux
 */

import type { PaginationParams, PaginatedResponse } from '../types/global'
import { ref, type Ref } from 'vue'

export interface TablePageState<T> {
  data: Ref<T[]>
  pagination: Ref<PaginatedResponse<T>['pagination'] | null>
  currentPage: Ref<number>
  pageSize: Ref<number>
  loading: Ref<boolean>
  searchQuery: Ref<string>
  searchTimeout: Ref<number | null>
}

export function createTablePageState<T>(
  initialPageSize: number = 10
): TablePageState<T> {
  return {
    data: ref([]) as Ref<T[]>,
    pagination: ref(null) as Ref<PaginatedResponse<T>['pagination'] | null>,
    currentPage: ref(1),
    pageSize: ref(initialPageSize),
    loading: ref(false),
    searchQuery: ref(''),
    searchTimeout: ref<number | null>(null)
  }
}

export function createTablePageHandlers<T>(
  state: TablePageState<T>,
  loadData: (params: PaginationParams) => Promise<PaginatedResponse<T>>
) {
  const loadDataWithState = async () => {
    state.loading.value = true
    try {
      const params: PaginationParams = {
        page: state.currentPage.value,
        limit: state.pageSize.value,
        search: state.searchQuery.value || undefined,
        sortBy: 'name',
        sortOrder: 'asc'
      }
      
      const response = await loadData(params)
      state.data.value = response.data
      state.pagination.value = response.pagination
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      if (window.showNotification) {
        window.showNotification('error', 'Erreur', 'Impossible de charger les données')
      }
    } finally {
      state.loading.value = false
    }
  }

  const onPageChange = (page: number) => {
    state.currentPage.value = page
    loadDataWithState()
  }

  const onPageSizeChange = (newPageSize: number) => {
    state.pageSize.value = newPageSize
    state.currentPage.value = 1 // Reset à la première page
    loadDataWithState()
  }

  const onSearchChange = () => {
    // Debounce de la recherche
    if (state.searchTimeout.value) {
      clearTimeout(state.searchTimeout.value)
    }
    
    state.searchTimeout.value = setTimeout(() => {
      state.currentPage.value = 1 // Reset à la première page lors de la recherche
      loadDataWithState()
    }, 500)
  }

  return {
    loadDataWithState,
    onPageChange,
    onPageSizeChange,
    onSearchChange
  }
}

export function createTableLoadingRow(colspan: number) {
  return {
    loading: {
      colspan,
      message: 'Chargement des données...'
    }
  }
}

export function createTableEmptyRow(colspan: number) {
  return {
    empty: {
      colspan,
      message: 'Aucun résultat trouvé',
      subMessage: 'Essayez de modifier vos critères de recherche'
    }
  }
}
