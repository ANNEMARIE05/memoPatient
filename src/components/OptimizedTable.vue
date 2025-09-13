<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- En-tête du tableau avec actions -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <!-- Actions principales -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <slot name="actions" />
        </div>
        
        <!-- Filtres et recherche -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <slot name="filters" />
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              @click="column.sortable ? sortBy(column.key) : null"
              :class="[
                'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
              ]"
            >
              <div class="flex items-center space-x-2">
                <span>{{ column.label }}</span>
                <font-awesome-icon 
                  v-if="column.sortable && sortField === column.key"
                  :icon="sortOrder === 'asc' ? 'sort-up' : 'sort-down'"
                  class="text-gray-400 text-xs"
                />
              </div>
            </th>
            <th v-if="showActions" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Indicateur de chargement -->
          <tr v-if="loading" class="bg-gray-50">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="px-4 py-8 text-center">
              <div class="flex items-center justify-center space-x-2">
                <font-awesome-icon icon="spinner" class="animate-spin text-blue-600" />
                <span class="text-gray-600">{{ loadingText }}</span>
              </div>
            </td>
          </tr>
          
          <!-- Message si aucun résultat -->
          <tr v-else-if="!loading && data.length === 0" class="bg-gray-50">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="px-4 py-8 text-center">
              <div class="text-gray-500">
                <font-awesome-icon :icon="emptyIcon" class="text-4xl mb-2" />
                <p>{{ emptyText }}</p>
                <p v-if="emptySubtext" class="text-sm">{{ emptySubtext }}</p>
              </div>
            </td>
          </tr>
          
          <!-- Données -->
          <tr v-else v-for="(item, index) in data" :key="getItemKey(item, index)" class="hover:bg-gray-50 transition-colors">
            <td v-for="column in columns" :key="column.key" class="px-4 py-3">
              <slot 
                :name="`cell-${column.key}`" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
                :column="column"
              >
                <span class="text-sm text-gray-900">
                  {{ formatCellValue(getNestedValue(item, column.key), column) }}
                </span>
              </slot>
            </td>
            <td v-if="showActions" class="px-4 py-3">
              <slot name="actions-cell" :item="item">
                <ActionButtons
                  :show-view="showView"
                  :show-edit="showEdit"
                  :show-delete="showDelete"
                  :show-resend="showResend"
                  :show-duplicate="showDuplicate"
                  :show-export="showExport"
                  @view="$emit('view', item)"
                  @edit="$emit('edit', item)"
                  @delete="$emit('delete', item)"
                  @resend="$emit('resend', item)"
                  @duplicate="$emit('duplicate', item)"
                  @export="$emit('export', item)"
                />
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <PaginationComponent
      v-if="pagination && pagination.totalPages > 1"
      :pagination="pagination"
      :loading="loading"
      @page-change="$emit('page-change', $event)"
      @page-size-change="$emit('page-size-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActionButtons from './ActionButtons.vue'
import PaginationComponent from './PaginationComponent.vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  type?: 'text' | 'date' | 'number' | 'boolean' | 'status'
  format?: (value: any) => string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: Pagination
  showActions?: boolean
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showResend?: boolean
  showDuplicate?: boolean
  showExport?: boolean
  loadingText?: string
  emptyText?: string
  emptySubtext?: string
  emptyIcon?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  showView: true,
  showEdit: true,
  showDelete: true,
  showResend: false,
  showDuplicate: false,
  showExport: false,
  loadingText: 'Chargement...',
  emptyText: 'Aucun élément trouvé',
  emptySubtext: 'Essayez de modifier vos critères de recherche',
  emptyIcon: 'inbox',
  sortField: '',
  sortOrder: 'asc'
})

const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
  'sort-change': [field: string, order: 'asc' | 'desc']
  view: [item: any]
  edit: [item: any]
  delete: [item: any]
  resend: [item: any]
  duplicate: [item: any]
  export: [item: any]
}>()

// Fonction pour obtenir la clé unique d'un élément
const getItemKey = (item: any, index: number): string | number => {
  return item.uuid || item.id || index
}

// Fonction pour obtenir une valeur imbriquée
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

// Fonction pour formater la valeur d'une cellule
const formatCellValue = (value: any, column: Column): string => {
  if (column.format) {
    return column.format(value)
  }
  
  if (value === null || value === undefined) {
    return '-'
  }
  
  switch (column.type) {
    case 'date':
      return new Date(value).toLocaleDateString('fr-FR')
    case 'number':
      return typeof value === 'number' ? value.toLocaleString('fr-FR') : value.toString()
    case 'boolean':
      return value ? 'Oui' : 'Non'
    default:
      return value.toString()
  }
}

// Fonction de tri
const sortBy = (field: string) => {
  const newOrder = props.sortField === field && props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort-change', field, newOrder)
}
</script>
