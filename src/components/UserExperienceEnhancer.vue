<template>
  <div>
    <!-- Composant pour améliorer l'UX -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// Améliorations UX globales
onMounted(() => {
  // Ajouter des raccourcis clavier
  document.addEventListener('keydown', handleKeyboardShortcuts)
  
  // Améliorer l'accessibilité
  enhanceAccessibility()
  
  // Optimiser les performances
  optimizePerformance()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})

// Raccourcis clavier
const handleKeyboardShortcuts = (event: KeyboardEvent) => {
  // Ctrl/Cmd + S pour sauvegarder
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    const saveButton = document.querySelector('button[type="submit"], button:contains("Enregistrer"), button:contains("Sauvegarder")') as HTMLButtonElement
    if (saveButton && !saveButton.disabled) {
      saveButton.click()
    }
  }
  
  // Échap pour annuler/fermer
  if (event.key === 'Escape') {
    const cancelButton = document.querySelector('button:contains("Annuler"), button:contains("Fermer")') as HTMLButtonElement
    if (cancelButton) {
      cancelButton.click()
    }
  }
  
  // Entrée pour valider les formulaires
  if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
    const form = event.target.closest('form')
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
      if (submitButton && !submitButton.disabled) {
        submitButton.click()
      }
    }
  }
}

// Améliorer l'accessibilité
const enhanceAccessibility = () => {
  // Ajouter des attributs ARIA manquants
  const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])')
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      const text = button.textContent?.trim()
      if (text) {
        button.setAttribute('aria-label', text)
      }
    }
  })
  
  // Améliorer la navigation au clavier
  const interactiveElements = document.querySelectorAll('button, input, select, textarea, [tabindex]')
  interactiveElements.forEach(element => {
    if (!element.getAttribute('tabindex') && element instanceof HTMLElement) {
      element.setAttribute('tabindex', '0')
    }
  })
}

// Optimiser les performances
const optimizePerformance = () => {
  // Lazy loading des images
  const images = document.querySelectorAll('img[data-src]')
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
  
  // Debounce des recherches
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="recherche"], input[placeholder*="Rechercher"]')
  searchInputs.forEach(input => {
    let timeout: number
    input.addEventListener('input', () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        // Déclencher la recherche
        input.dispatchEvent(new Event('search'))
      }, 300)
    })
  })
}

// Fonctions utilitaires pour l'UX
export const showLoadingState = (element: HTMLElement) => {
  element.style.opacity = '0.6'
  element.style.pointerEvents = 'none'
}

export const hideLoadingState = (element: HTMLElement) => {
  element.style.opacity = '1'
  element.style.pointerEvents = 'auto'
}

export const showSuccessMessage = (message: string) => {
  if (window.showNotification) {
    window.showNotification('success', 'Succès', message)
  }
}

export const showErrorMessage = (message: string) => {
  if (window.showNotification) {
    window.showNotification('error', 'Erreur', message)
  }
}

export const showInfoMessage = (message: string) => {
  if (window.showNotification) {
    window.showNotification('info', 'Information', message)
  }
}

export const confirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.confirm) {
      resolve(window.confirm(message))
    } else {
      resolve(true)
    }
  })
}
</script>
