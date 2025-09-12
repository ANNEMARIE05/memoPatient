export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist'
  permissions: Permission[]
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: 'patients' | 'medical_records' | 'appointments' | 'sms' | 'users' | 'reports'
  action: 'read' | 'write' | 'delete' | 'admin'
}

export interface UserRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

class UserService {
  private permissions: Permission[] = [
    // Patients permissions
    { id: 'P001', name: 'Voir les patients', description: 'Consulter la liste des patients', resource: 'patients', action: 'read' },
    { id: 'P002', name: 'Ajouter des patients', description: 'Créer de nouveaux patients', resource: 'patients', action: 'write' },
    { id: 'P003', name: 'Modifier les patients', description: 'Modifier les informations des patients', resource: 'patients', action: 'write' },
    { id: 'P004', name: 'Supprimer les patients', description: 'Supprimer des patients', resource: 'patients', action: 'delete' },
    
    // Medical records permissions
    { id: 'M001', name: 'Voir les dossiers médicaux', description: 'Consulter les dossiers médicaux', resource: 'medical_records', action: 'read' },
    { id: 'M002', name: 'Modifier les dossiers', description: 'Modifier les dossiers médicaux', resource: 'medical_records', action: 'write' },
    
    // Appointments permissions
    { id: 'A001', name: 'Voir les rendez-vous', description: 'Consulter les rendez-vous', resource: 'appointments', action: 'read' },
    { id: 'A002', name: 'Gérer les rendez-vous', description: 'Créer et modifier les rendez-vous', resource: 'appointments', action: 'write' },
    
    // SMS permissions
    { id: 'S001', name: 'Envoyer des SMS', description: 'Envoyer des messages SMS', resource: 'sms', action: 'write' },
    { id: 'S002', name: 'Voir l\'historique SMS', description: 'Consulter l\'historique des SMS', resource: 'sms', action: 'read' },
    
    // Users permissions
    { id: 'U001', name: 'Gérer les utilisateurs', description: 'Créer et modifier les utilisateurs', resource: 'users', action: 'admin' },
    
    // Reports permissions
    { id: 'R001', name: 'Voir les rapports', description: 'Consulter les rapports et statistiques', resource: 'reports', action: 'read' },
    { id: 'R002', name: 'Exporter les données', description: 'Exporter les données en format CSV/PDF', resource: 'reports', action: 'write' }
  ]

  private roles: UserRole[] = [
    {
      id: 'admin',
      name: 'Administrateur',
      description: 'Accès complet à toutes les fonctionnalités',
      permissions: this.permissions
    },
    {
      id: 'doctor',
      name: 'Médecin',
      description: 'Accès aux patients, dossiers médicaux et rendez-vous',
      permissions: this.permissions.filter(p => 
        ['patients', 'medical_records', 'appointments'].includes(p.resource)
      )
    },
    {
      id: 'nurse',
      name: 'Infirmière',
      description: 'Accès limité aux patients et dossiers médicaux',
      permissions: this.permissions.filter(p => 
        p.resource === 'patients' && p.action === 'read' ||
        p.resource === 'medical_records' && p.action === 'read' ||
        p.resource === 'appointments' && p.action === 'read'
      )
    },
    {
      id: 'receptionist',
      name: 'Réceptionniste',
      description: 'Accès aux patients, rendez-vous et SMS',
      permissions: this.permissions.filter(p => 
        ['patients', 'appointments', 'sms'].includes(p.resource) && p.action !== 'admin'
      )
    }
  ]

  private users: User[] = [
    {
      id: 'U001',
      username: 'admin',
      email: 'admin@memopatient.com',
      firstName: 'Administrateur',
      lastName: 'Système',
      role: 'admin',
      permissions: this.roles.find(r => r.id === 'admin')?.permissions || [],
      isActive: true,
      lastLogin: '2024-12-15T10:30:00',
      createdAt: '2024-01-01',
      updatedAt: '2024-12-15'
    },
    {
      id: 'U002',
      username: 'dr.martin',
      email: 'dr.martin@memopatient.com',
      firstName: 'Dr. Jean',
      lastName: 'Martin',
      role: 'doctor',
      permissions: this.roles.find(r => r.id === 'doctor')?.permissions || [],
      isActive: true,
      lastLogin: '2024-12-15T09:15:00',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-15'
    },
    {
      id: 'U003',
      username: 'inf.sophie',
      email: 'sophie.laurent@memopatient.com',
      firstName: 'Sophie',
      lastName: 'Laurent',
      role: 'nurse',
      permissions: this.roles.find(r => r.id === 'nurse')?.permissions || [],
      isActive: true,
      lastLogin: '2024-12-14T16:45:00',
      createdAt: '2024-02-01',
      updatedAt: '2024-12-14'
    },
    {
      id: 'U004',
      username: 'rec.marie',
      email: 'marie.dubois@memopatient.com',
      firstName: 'Marie',
      lastName: 'Dubois',
      role: 'receptionist',
      permissions: this.roles.find(r => r.id === 'receptionist')?.permissions || [],
      isActive: true,
      lastLogin: '2024-12-15T08:30:00',
      createdAt: '2024-02-15',
      updatedAt: '2024-12-15'
    }
  ]

  private currentUser: User | null = null

  getAllUsers(): User[] {
    return this.users
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  setCurrentUser(user: User): void {
    this.currentUser = user
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  login(username: string, password: string): User | null {
    // Simulation d'authentification
    const user = this.users.find(u => u.username === username && u.isActive)
    if (user) {
      user.lastLogin = new Date().toISOString()
      this.setCurrentUser(user)
      return user
    }
    return null
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isAuthenticated')
  }

  hasPermission(user: User, resource: string, action: string): boolean {
    return user.permissions.some(permission => 
      permission.resource === resource && permission.action === action
    )
  }

  canAccess(user: User, resource: string, action: string): boolean {
    if (user.role === 'admin') return true
    return this.hasPermission(user, resource, action)
  }

  getAllRoles(): UserRole[] {
    return this.roles
  }

  getRoleById(id: string): UserRole | undefined {
    return this.roles.find(role => role.id === id)
  }

  getAllPermissions(): Permission[] {
    return this.permissions
  }

  addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'permissions'>): User {
    const role = this.getRoleById(userData.role)
    const newUser: User = {
      ...userData,
      id: `U${String(this.users.length + 1).padStart(3, '0')}`,
      permissions: role?.permissions || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    this.users.push(newUser)
    return newUser
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    return this.users[index]
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) return false
    
    this.users.splice(index, 1)
    return true
  }

  // Initialiser l'utilisateur actuel depuis le localStorage
  initCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser)
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur stocké:', error)
        localStorage.removeItem('currentUser')
      }
    }
  }
}

export const userService = new UserService()

// Initialiser l'utilisateur actuel au démarrage
userService.initCurrentUser()
