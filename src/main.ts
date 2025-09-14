import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import Swal from 'sweetalert2'
import i18n from './i18n'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import components
import LoginPage from './views/LoginPage.vue'
import Dashboard from './views/Dashboard.vue'
import UsersPage from './views/UsersPage.vue'
import UserFormPage from './views/UserFormPage.vue'
import UserDetailPage from './views/UserDetailPage.vue'
import ProfilesPage from './views/ProfilesPage.vue'
import ProfileFormPage from './views/ProfileFormPage.vue'
import ProfileDetailPage from './views/ProfileDetailPage.vue'
import ProfilePermissionsPage from './views/ProfilePermissionsPage.vue'
import MessageTemplatesPage from './views/MessageTemplatesPage.vue'
import MessageTemplateFormPage from './views/MessageTemplateFormPage.vue'
import MessageTemplateDetailPage from './views/MessageTemplateDetailPage.vue'
import MessageHistoryPage from './views/MessageHistoryPage.vue'
import MessageHistoryDetailPage from './views/MessageHistoryDetailPage.vue'
import PatientsPage from './views/PatientsPage.vue'
import PatientDetailPage from './views/PatientDetailPage.vue'
import PatientFormPage from './views/PatientFormPage.vue'
import MedicalRecordsPage from './views/MedicalRecordsPage.vue'
import MedicalRecordFormPage from './views/MedicalRecordFormPage.vue'
import MedicalRecordDetailPage from './views/MedicalRecordDetailPage.vue'
import AppointmentsPage from './views/AppointmentsPage.vue'
import AppointmentFormPage from './views/AppointmentFormPage.vue'
import AppointmentDetailPage from './views/AppointmentDetailPage.vue'
import SMSPage from './views/SMSPage.vue'
import ProfilePage from './views/ProfilePage.vue'
import MessageTypesPage from './views/MessageTypesPage.vue'
import MessageTypeFormPage from './views/MessageTypeFormPage.vue'
import GeographicLocationsPage from './views/GeographicLocationsPage.vue'
import GeographicLocationDetailPage from './views/GeographicLocationDetailPage.vue'
import GeographicLocationFormPage from './views/GeographicLocationFormPage.vue'
import AuthGuard from './components/AuthGuard.vue'

// Add icons to library
library.add(fas)

// Router configuration
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { 
    path: '/dashboard', 
    component: AuthGuard,
    children: [
      { path: '', component: Dashboard }
    ]
  },
  { 
    path: '/users', 
    component: AuthGuard,
    children: [
      { path: '', component: UsersPage },
      { path: 'create', component: UserFormPage },
      { path: ':uuid', component: UserDetailPage },
      { path: ':uuid/edit', component: UserFormPage }
    ]
  },
  { 
    path: '/profiles', 
    component: AuthGuard,
    children: [
      { path: '', component: ProfilesPage },
      { path: 'create', component: ProfileFormPage },
      { path: ':id', component: ProfileDetailPage },
      { path: ':id/edit', component: ProfileFormPage },
      { path: ':id/permissions', component: ProfilePermissionsPage }
    ]
  },
  { 
    path: '/message-templates', 
    component: AuthGuard,
    children: [
      { path: '', component: MessageTemplatesPage },
      { path: 'create', component: MessageTemplateFormPage },
      { path: ':uuid', component: MessageTemplateDetailPage },
      { path: ':uuid/edit', component: MessageTemplateFormPage }
    ]
  },
  { 
    path: '/message-history', 
    component: AuthGuard,
    children: [
      { path: '', component: MessageHistoryPage },
      { path: ':uuid', component: MessageHistoryDetailPage }
    ]
  },
  { 
    path: '/patients', 
    component: AuthGuard,
    children: [
      { path: '', component: PatientsPage },
      { path: 'create', component: PatientFormPage },
      { path: ':uuid', component: PatientDetailPage },
      { path: ':uuid/edit', component: PatientFormPage }
    ]
  },
  { 
    path: '/medical-records', 
    component: AuthGuard,
    children: [
      { path: '', component: MedicalRecordsPage },
      { path: 'create', component: MedicalRecordFormPage },
      { path: ':uuid', component: MedicalRecordDetailPage },
      { path: ':uuid/edit', component: MedicalRecordFormPage }
    ]
  },
  { 
    path: '/appointments', 
    component: AuthGuard,
    children: [
      { path: '', component: AppointmentsPage },
      { path: 'create', component: AppointmentFormPage },
      { path: ':uuid', component: AppointmentDetailPage },
      { path: ':uuid/edit', component: AppointmentFormPage }
    ]
  },
  { 
    path: '/sms', 
    component: AuthGuard,
    children: [
      { path: '', component: SMSPage }
    ]
  },
  { 
    path: '/profile', 
    component: AuthGuard,
    children: [
      { path: '', component: ProfilePage }
    ]
  },
  { 
    path: '/message-types', 
    component: AuthGuard,
    children: [
      { path: '', component: MessageTypesPage },
      { path: 'create', component: MessageTypeFormPage },
      { path: ':uuid/edit', component: MessageTypeFormPage }
    ]
  },
  { 
    path: '/geographic-locations', 
    component: AuthGuard,
    children: [
      { path: '', component: GeographicLocationsPage },
      { path: 'create', component: GeographicLocationFormPage },
      { path: ':id', component: GeographicLocationDetailPage },
      { path: ':id/edit', component: GeographicLocationFormPage }
    ]
  },
  { 
    path: '/localization', 
    component: AuthGuard,
    children: [
      { path: '', component: GeographicLocationsPage },
      { path: 'create', component: GeographicLocationFormPage },
      { path: ':id', component: GeographicLocationDetailPage },
      { path: ':id/edit', component: GeographicLocationFormPage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Configuration globale de SweetAlert2
Swal.mixin({
  position: 'top-start',
  toast: true,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

// Configuration pour les modales de confirmation
Swal.mixin({
  position: 'top-start',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Oui, confirmer',
  cancelButtonText: 'Non, annuler'
})

// Définir la fonction de notification globale
window.showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration?: number) => {
  Swal.fire({
    icon: type,
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: duration || 3000,
    timerProgressBar: true
  })
}

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(i18n)
app.mount('#app')