declare global {
  interface Window {
    showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration?: number) => void
  }
}

export {}
