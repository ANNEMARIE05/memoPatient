import type { PaginationParams, PaginatedResponse } from '../types/global'

export interface Profile {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  status: string
  userCount: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProfileStats {
  total: number
  active: number
  admins: number
  doctors: number
}

class ProfileService {
  private profiles: Profile[] = [
    {
      id: 'PROF001',
      name: 'Administrateur',
      code: 'ADMIN',
      description: 'Accès complet au système avec toutes les permissions',
      permissions: [
        'users.read', 'users.create', 'users.edit', 'users.delete',
        'patients.read', 'patients.create', 'patients.edit', 'patients.delete',
        'appointments.read', 'appointments.create', 'appointments.edit', 'appointments.delete',
        'medical_records.read', 'medical_records.create', 'medical_records.edit', 'medical_records.delete',
        'messages.read', 'messages.send',
        'templates.read', 'templates.create', 'templates.edit', 'templates.delete',
        'dashboard.read', 'reports.read'
      ],
      status: 'active',
      userCount: 1,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 'PROF002',
      name: 'Médecin',
      code: 'MEDECIN',
      description: 'Accès médical complet aux patients et dossiers',
      permissions: [
        'patients.read', 'patients.create', 'patients.edit',
        'medical_records.read', 'medical_records.create', 'medical_records.edit',
        'appointments.read', 'appointments.create', 'appointments.edit',
        'messages.read', 'messages.send',
        'dashboard.read', 'reports.read'
      ],
      status: 'active',
      userCount: 2,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 'PROF003',
      name: 'Secrétaire',
      code: 'SECRET',
      description: 'Accès administratif aux patients et rendez-vous',
      permissions: [
        'patients.read', 'patients.create', 'patients.edit',
        'appointments.read', 'appointments.create', 'appointments.edit',
        'medical_records.read',
        'messages.read', 'messages.send',
        'dashboard.read'
      ],
      status: 'active',
      userCount: 1,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      id: 'PROF004',
      name: 'Infirmier',
      code: 'INFIRM',
      description: 'Accès limité aux informations médicales',
      permissions: [
        'patients.read',
        'medical_records.read',
        'appointments.read', 'appointments.create',
        'messages.read', 'messages.send',
        'dashboard.read'
      ],
      status: 'active',
      userCount: 0,
      active: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    }
  ]

  // Méthode pour obtenir tous les profils avec pagination
  getProfiles(params: PaginationParams): PaginatedResponse<Profile> {
    let filteredProfiles = [...this.profiles]
    
    // Recherche
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.name.toLowerCase().includes(searchLower) ||
        profile.description.toLowerCase().includes(searchLower) ||
        profile.id.toLowerCase().includes(searchLower)
      )
    }
    
    // Tri
    if (params.sortBy) {
      filteredProfiles.sort((a, b) => {
        const aValue = this.getNestedValue(a, params.sortBy!)
        const bValue = this.getNestedValue(b, params.sortBy!)
        
        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }
    
    // Pagination
    const total = filteredProfiles.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedData = filteredProfiles.slice(startIndex, endIndex)
    
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

  getAllProfiles(): Profile[] {
    return this.profiles
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find(profile => profile.id === id)
  }

  getProfilesStats(): ProfileStats {
    const total = this.profiles.length
    const active = this.profiles.filter(p => p.active).length
    const admins = this.profiles.filter(p => p.name === 'Administrateur').length
    const doctors = this.profiles.filter(p => p.name === 'Médecin').length

    return {
      total,
      active,
      admins,
      doctors
    }
  }

  addProfile(profileData: Omit<Profile, 'id' | 'userCount' | 'active' | 'createdAt' | 'updatedAt'>): Profile {
    const newProfile: Profile = {
      ...profileData,
      id: `PROF${String(this.profiles.length + 1).padStart(3, '0')}`,
      userCount: 0,
      active: profileData.status === 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.profiles.push(newProfile)
    return newProfile
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | null {
    const index = this.profiles.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.profiles[index] = {
      ...this.profiles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.profiles[index]
  }

  deleteProfile(id: string): boolean {
    const index = this.profiles.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.profiles.splice(index, 1)
    return true
  }

  searchProfiles(query: string): Profile[] {
    const lowercaseQuery = query.toLowerCase()
    return this.profiles.filter(profile =>
      profile.name.toLowerCase().includes(lowercaseQuery) ||
      profile.description.toLowerCase().includes(lowercaseQuery) ||
      profile.id.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Méthodes utilitaires
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}

export const profileService = new ProfileService()
