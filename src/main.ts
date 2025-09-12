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
import PatientsPage from './views/PatientsPage.vue'
import MedicalRecordsPage from './views/MedicalRecordsPage.vue'
import AppointmentsPage from './views/AppointmentsPage.vue'
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
    path: '/patients', 
    component: AuthGuard,
    children: [
      { path: '', component: PatientsPage }
    ]
  },
  { 
    path: '/medical-records', 
    component: AuthGuard,
    children: [
      { path: '', component: MedicalRecordsPage }
    ]
  },
  { 
    path: '/appointments', 
    component: AuthGuard,
    children: [
      { path: '', component: AppointmentsPage }
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