<template>
  <div class="flex items-center space-x-2">
    <!-- Bouton Voir -->
    <button 
      v-if="showView"
      @click="$emit('view')" 
      class="text-blue-600 hover:text-blue-800 text-sm transition-colors" 
      :title="viewTitle || 'Voir les détails'"
    >
      <font-awesome-icon icon="eye" />
    </button>
    
    <!-- Bouton Modifier -->
    <button 
      v-if="showEdit"
      @click="$emit('edit')" 
      class="text-green-600 hover:text-green-800 text-sm transition-colors" 
      :title="editTitle || 'Modifier'"
    >
      <font-awesome-icon icon="edit" />
    </button>
    
    <!-- Bouton Supprimer -->
    <button 
      v-if="showDelete"
      @click="$emit('delete')" 
      class="text-red-600 hover:text-red-800 text-sm transition-colors" 
      :title="deleteTitle || 'Supprimer'"
    >
      <font-awesome-icon icon="trash" />
    </button>
    
    <!-- Bouton Relancer (pour les messages) -->
    <button 
      v-if="showResend"
      @click="$emit('resend')" 
      class="text-orange-600 hover:text-orange-800 text-sm transition-colors" 
      :title="resendTitle || 'Relancer'"
    >
      <font-awesome-icon icon="redo" />
    </button>
    
    <!-- Bouton Dupliquer -->
    <button 
      v-if="showDuplicate"
      @click="$emit('duplicate')" 
      class="text-purple-600 hover:text-purple-800 text-sm transition-colors" 
      :title="duplicateTitle || 'Dupliquer'"
    >
      <font-awesome-icon icon="copy" />
    </button>
    
    <!-- Bouton Exporter -->
    <button 
      v-if="showExport"
      @click="$emit('export')" 
      class="text-indigo-600 hover:text-indigo-800 text-sm transition-colors" 
      :title="exportTitle || 'Exporter'"
    >
      <font-awesome-icon icon="download" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showResend?: boolean
  showDuplicate?: boolean
  showExport?: boolean
  viewTitle?: string
  editTitle?: string
  deleteTitle?: string
  resendTitle?: string
  duplicateTitle?: string
  exportTitle?: string
}

withDefaults(defineProps<Props>(), {
  showView: true,
  showEdit: true,
  showDelete: true,
  showResend: false,
  showDuplicate: false,
  showExport: false
})

defineEmits<{
  view: []
  edit: []
  delete: []
  resend: []
  duplicate: []
  export: []
}>()
</script>
