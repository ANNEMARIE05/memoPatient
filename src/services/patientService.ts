import type { Patient, PaginationParams, PaginatedResponse, PatientStats } from '../types/global'

class PatientService {
  private patients: Patient[] = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440001',
      firstname: 'Marie',
      lastname: 'Dubois',
      birthdate: '1979-03-15',
      sexe: 'F',
      genre: 'Féminin',
      phone1: '06 12 34 56 78',
      phone2: '06 98 76 54 32',
      email: 'marie.dubois@email.com',
      adresse: '123 Rue de la Paix, Paris',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      firstname: 'Jean',
      lastname: 'Martin',
      birthdate: '1992-07-22',
      sexe: 'M',
      genre: 'Masculin',
      phone1: '06 23 45 67 89',
      phone2: '06 87 65 43 21',
      email: 'jean.martin@email.com',
      adresse: '456 Avenue des Champs, Lyon',
      created_at: '2024-02-20T14:30:00Z',
      updated_at: '2024-12-10T14:30:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440003',
      firstname: 'Sophie',
      lastname: 'Laurent',
      birthdate: '1996-11-08',
      sexe: 'F',
      genre: 'Féminin',
      phone1: '06 34 56 78 90',
      phone2: '06 76 54 32 10',
      email: 'sophie.laurent@email.com',
      adresse: '789 Boulevard Saint-Germain, Marseille',
      created_at: '2024-03-10T09:15:00Z',
      updated_at: '2024-12-08T09:15:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440004',
      firstname: 'Pierre',
      lastname: 'Moreau',
      birthdate: '1969-05-12',
      sexe: 'M',
      genre: 'Masculin',
      phone1: '06 45 67 89 01',
      phone2: '06 65 43 21 09',
      email: 'pierre.moreau@email.com',
      adresse: '321 Rue de Rivoli, Toulouse',
      created_at: '2024-01-05T16:45:00Z',
      updated_at: '2024-12-05T16:45:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440005',
      firstname: 'Claire',
      lastname: 'Bernard',
      birthdate: '1983-09-30',
      sexe: 'F',
      genre: 'Féminin',
      phone1: '06 56 78 90 12',
      phone2: '06 54 32 10 98',
      email: 'claire.bernard@email.com',
      adresse: '654 Place Bellecour, Nice',
      created_at: '2024-02-15T11:30:00Z',
      updated_at: '2024-12-12T11:30:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440006',
      firstname: 'Michel',
      lastname: 'Durand',
      birthdate: '1957-12-03',
      sexe: 'M',
      genre: 'Masculin',
      phone1: '06 67 89 01 23',
      phone2: '06 43 21 09 87',
      email: 'michel.durand@email.com',
      adresse: '987 Rue de la République, Bordeaux',
      created_at: '2024-01-20T08:20:00Z',
      updated_at: '2024-12-03T08:20:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
  ]

  // Méthode pour obtenir tous les patients avec pagination (SSR)
  async getPatients(params: PaginationParams): Promise<PaginatedResponse<Patient>> {
    // Simulation d'un délai réseau pour SSR
    await new Promise(resolve => setTimeout(resolve, 300))
    let filteredPatients = [...this.patients]
    
    // Recherche
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredPatients = filteredPatients.filter(patient =>
        `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(searchLower) ||
        patient.uuid.toLowerCase().includes(searchLower) ||
        patient.phone1.includes(params.search!) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.adresse.toLowerCase().includes(searchLower)
      )
    }
    
    // Filtres
    if (params.filters) {
      if (params.filters.sexe) {
        filteredPatients = filteredPatients.filter(p => p.sexe === params.filters!.sexe)
      }
      if (params.filters.genre) {
        filteredPatients = filteredPatients.filter(p => p.genre === params.filters!.genre)
      }
      if (params.filters.dateStart) {
        filteredPatients = filteredPatients.filter(p => 
          new Date(p.created_at) >= new Date(params.filters!.dateStart)
        )
      }
      if (params.filters.dateEnd) {
        filteredPatients = filteredPatients.filter(p => 
          new Date(p.created_at) <= new Date(params.filters!.dateEnd)
        )
      }
    }
    
    // Tri
    if (params.sortBy) {
      filteredPatients.sort((a, b) => {
        const aValue = this.getNestedValue(a, params.sortBy!)
        const bValue = this.getNestedValue(b, params.sortBy!)
        
        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }
    
    // Pagination
    const total = filteredPatients.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedData = filteredPatients.slice(startIndex, endIndex)
    
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

  getAllPatients(): Patient[] {
    return this.patients
  }

  getPatientById(uuid: string): Patient | undefined {
    return this.patients.find(patient => patient.uuid === uuid)
  }

  getPatientsStats(): PatientStats {
    const total = this.patients.length
    const active = this.patients.length // Tous actifs par défaut
    const inactive = 0
    
    // Patients nouveaux ce mois (simulation)
    const newThisMonth = 89
    
    const genderDistribution = {
      male: this.patients.filter(p => p.sexe === 'M').length,
      female: this.patients.filter(p => p.sexe === 'F').length
    }
    
    const ageGroups = {
      '0-18': this.patients.filter(p => this.calculateAge(p.birthdate) <= 18).length,
      '19-35': this.patients.filter(p => {
        const age = this.calculateAge(p.birthdate)
        return age >= 19 && age <= 35
      }).length,
      '36-55': this.patients.filter(p => {
        const age = this.calculateAge(p.birthdate)
        return age >= 36 && age <= 55
      }).length,
      '55+': this.patients.filter(p => this.calculateAge(p.birthdate) > 55).length
    }

    return {
      total,
      active,
      inactive,
      newThisMonth,
      genderDistribution,
      ageGroups
    }
  }

  addPatient(patientData: Omit<Patient, 'uuid' | 'created_at' | 'updated_at' | 'created_user' | 'updated_user'>): Patient {
    const newPatient: Patient = {
      ...patientData,
      uuid: this.generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    this.patients.push(newPatient)
    return newPatient
  }

  updatePatient(uuid: string, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(p => p.uuid === uuid)
    if (index === -1) return null
    
    this.patients[index] = {
      ...this.patients[index],
      ...updates,
      updated_at: new Date().toISOString(),
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    return this.patients[index]
  }

  deletePatient(uuid: string): boolean {
    const index = this.patients.findIndex(p => p.uuid === uuid)
    if (index === -1) return false
    
    this.patients.splice(index, 1)
    return true
  }

  searchPatients(query: string): Patient[] {
    const lowercaseQuery = query.toLowerCase()
    return this.patients.filter(patient =>
      `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(lowercaseQuery) ||
      patient.uuid.toLowerCase().includes(lowercaseQuery) ||
      patient.phone1.includes(query) ||
      patient.email.toLowerCase().includes(lowercaseQuery) ||
      patient.adresse.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Méthodes utilitaires
  private calculateAge(birthdate: string): number {
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  private generateUUID(): string {
    return '550e8400-e29b-41d4-a716-' + Math.random().toString(36).substr(2, 12).padStart(12, '0')
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}

export const patientService = new PatientService()
