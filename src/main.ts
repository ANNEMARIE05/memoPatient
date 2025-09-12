import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

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
      { path: ':id/edit', component: ProfileFormPage }
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')