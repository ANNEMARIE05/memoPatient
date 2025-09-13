import type { User, PaginationParams, PaginatedResponse, UserStats } from '../types/global'

class UserService {
  private users: User[] = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      civility: 'M.',
      firstname: 'Admin',
      lastname: 'Système',
      email: 'admin@memopatient.com',
      password: 'admin123',
      otp: '123456',
      profil: 'Administrateur',
      phone1: '06 00 00 00 00',
      phone2: '06 00 00 00 01',
      sexe: 'M',
      genre: 'Masculin',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440010',
      civility: 'Dr.',
      firstname: 'Dr. Marie',
      lastname: 'Dubois',
      email: 'marie.dubois@memopatient.com',
      password: 'medecin123',
      otp: '654321',
      profil: 'Médecin',
      phone1: '06 11 11 11 11',
      phone2: '06 11 11 11 12',
      sexe: 'F',
      genre: 'Féminin',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440011',
      civility: 'Mme',
      firstname: 'Sophie',
      lastname: 'Martin',
      email: 'sophie.martin@memopatient.com',
      password: 'secretaire123',
      otp: '789012',
      profil: 'Secrétaire',
      phone1: '06 22 22 22 22',
      phone2: '06 22 22 22 23',
      sexe: 'F',
      genre: 'Féminin',
      created_at: '2024-02-01T09:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440012',
      civility: 'Dr.',
      firstname: 'Dr. Pierre',
      lastname: 'Durand',
      email: 'pierre.durand@memopatient.com',
      password: 'medecin456',
      otp: '345678',
      profil: 'Médecin',
      phone1: '06 33 33 33 33',
      phone2: '06 33 33 33 34',
      sexe: 'M',
      genre: 'Masculin',
      created_at: '2024-03-01T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
  ]

  // Méthode pour obtenir tous les utilisateurs avec pagination
  getUsers(params: PaginationParams): PaginatedResponse<User> {
    let filteredUsers = [...this.users]
    
    // Recherche
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchLower) ||
        user.uuid.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone1.includes(params.search!)
      )
    }
    
    // Filtres
    if (params.filters) {
      if (params.filters.profil) {
        filteredUsers = filteredUsers.filter(u => u.profil === params.filters!.profil)
      }
    }
    
    // Tri
    if (params.sortBy) {
      filteredUsers.sort((a, b) => {
        const aValue = this.getNestedValue(a, params.sortBy!)
        const bValue = this.getNestedValue(b, params.sortBy!)
        
        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }
    
    // Pagination
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedData = filteredUsers.slice(startIndex, endIndex)
    
    return {
      data: paginatedData,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1
      }
    }
  }

  getAllUsers(): User[] {
    return this.users
  }

  getUserById(uuid: string): User | undefined {
    return this.users.find(user => user.uuid === uuid)
  }

  getUsersStats(): UserStats {
    const total = this.users.length
    const active = this.users.length // Tous actifs par défaut
    const admins = this.users.filter(u => u.profil === 'Administrateur').length
    const newThisMonth = this.users.filter(u => {
      const userDate = new Date(u.created_at)
      const now = new Date()
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
    }).length

    return {
      total,
      active,
      inactive: total - active,
      newThisMonth,
      admins
    }
  }

  addUser(userData: Omit<User, 'uuid' | 'created_at' | 'updated_at' | 'created_user' | 'updated_user'>): User {
    const newUser: User = {
      ...userData,
      uuid: this.generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    this.users.push(newUser)
    return newUser
  }

  updateUser(uuid: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.uuid === uuid)
    if (index === -1) return null
    
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updated_at: new Date().toISOString(),
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    return this.users[index]
  }

  deleteUser(uuid: string): boolean {
    const index = this.users.findIndex(u => u.uuid === uuid)
    if (index === -1) return false
    
    this.users.splice(index, 1)
    return true
  }

  searchUsers(query: string): User[] {
    const lowercaseQuery = query.toLowerCase()
    return this.users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(lowercaseQuery) ||
      user.uuid.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.phone1.includes(query)
    )
  }

  // Méthodes utilitaires
  private generateUUID(): string {
    return '550e8400-e29b-41d4-a716-' + Math.random().toString(36).substr(2, 12).padStart(12, '0')
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}

export const userService = new UserService()