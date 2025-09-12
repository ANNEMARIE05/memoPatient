import type { MedicalFolder, Diagnosis, PaginationParams, PaginatedResponse, MedicalFolderStats } from '../types/global'

class MedicalFolderService {
  private diagnoses: Diagnosis[] = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440200',
      libelle: 'Hypertension artérielle',
      description: 'Pression artérielle élevée',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440201',
      libelle: 'Diabète type 2',
      description: 'Diabète non insulinodépendant',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440202',
      libelle: 'Asthme',
      description: 'Maladie inflammatoire des voies respiratoires',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
  ]

  private medicalFolders: MedicalFolder[] = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440300',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440001',
      medecin_uuid: '550e8400-e29b-41d4-a716-446655440000',
      diagnose_uuid: '550e8400-e29b-41d4-a716-446655440200',
      traitement: 'Médicaments antihypertenseurs',
      description: 'Patient souffrant d\'hypertension artérielle modérée',
      statut: 1,
      num_folder: 'MF001',
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440301',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440002',
      medecin_uuid: '550e8400-e29b-41d4-a716-446655440000',
      diagnose_uuid: '550e8400-e29b-41d4-a716-446655440201',
      traitement: 'Métformine et régime alimentaire',
      description: 'Diabète type 2 récemment diagnostiqué',
      statut: 1,
      num_folder: 'MF002',
      created_at: '2024-12-02T11:00:00Z',
      updated_at: '2024-12-02T11:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440302',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440003',
      medecin_uuid: '550e8400-e29b-41d4-a716-446655440000',
      diagnose_uuid: '550e8400-e29b-41d4-a716-446655440202',
      traitement: 'Ventoline et corticoïdes inhalés',
      description: 'Asthme allergique saisonnier',
      statut: 2,
      num_folder: 'MF003',
      created_at: '2024-12-03T12:00:00Z',
      updated_at: '2024-12-03T12:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
  ]

  // Méthode pour obtenir tous les dossiers médicaux avec pagination
  getMedicalFolders(params: PaginationParams): PaginatedResponse<MedicalFolder> {
    let filteredFolders = [...this.medicalFolders]
    
    // Recherche
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredFolders = filteredFolders.filter(folder =>
        folder.num_folder.toLowerCase().includes(searchLower) ||
        folder.uuid.toLowerCase().includes(searchLower) ||
        folder.patient_uuid.toLowerCase().includes(searchLower) ||
        folder.traitement.toLowerCase().includes(searchLower)
      )
    }
    
    // Filtres
    if (params.filters) {
      if (params.filters.statut !== undefined) {
        filteredFolders = filteredFolders.filter(f => f.statut === params.filters!.statut)
      }
    }
    
    // Tri
    if (params.sortBy) {
      filteredFolders.sort((a, b) => {
        const aValue = this.getNestedValue(a, params.sortBy!)
        const bValue = this.getNestedValue(b, params.sortBy!)
        
        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }
    
    // Pagination
    const total = filteredFolders.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedData = filteredFolders.slice(startIndex, endIndex)
    
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

  getAllMedicalFolders(): MedicalFolder[] {
    return this.medicalFolders
  }

  getMedicalFolderById(uuid: string): MedicalFolder | undefined {
    return this.medicalFolders.find(folder => folder.uuid === uuid)
  }

  getDiagnosisById(uuid: string): Diagnosis | undefined {
    return this.diagnoses.find(diagnosis => diagnosis.uuid === uuid)
  }

  getMedicalFoldersStats(): MedicalFolderStats {
    const totalFolders = this.medicalFolders.length
    const foldersThisMonth = this.medicalFolders.filter(f => {
      const folderDate = new Date(f.created_at)
      const now = new Date()
      return folderDate.getMonth() === now.getMonth() && folderDate.getFullYear() === now.getFullYear()
    }).length
    
    const activeFolders = this.medicalFolders.filter(f => f.statut === 1).length
    const archivedFolders = this.medicalFolders.filter(f => f.statut === 2).length

    return {
      totalFolders,
      foldersThisMonth,
      activeFolders,
      archivedFolders,
      consultations: activeFolders,
      prescriptions: activeFolders,
      labResults: archivedFolders
    }
  }

  addMedicalFolder(folderData: Omit<MedicalFolder, 'uuid' | 'created_at' | 'updated_at' | 'created_user' | 'updated_user'>): MedicalFolder {
    const newFolder: MedicalFolder = {
      ...folderData,
      uuid: this.generateUUID(),
      num_folder: `MF${String(this.medicalFolders.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    this.medicalFolders.push(newFolder)
    return newFolder
  }

  updateMedicalFolder(uuid: string, updates: Partial<MedicalFolder>): MedicalFolder | null {
    const index = this.medicalFolders.findIndex(f => f.uuid === uuid)
    if (index === -1) return null
    
    this.medicalFolders[index] = {
      ...this.medicalFolders[index],
      ...updates,
      updated_at: new Date().toISOString(),
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    return this.medicalFolders[index]
  }

  deleteMedicalFolder(uuid: string): boolean {
    const index = this.medicalFolders.findIndex(f => f.uuid === uuid)
    if (index === -1) return false
    
    this.medicalFolders.splice(index, 1)
    return true
  }

  searchMedicalFolders(query: string): MedicalFolder[] {
    const lowercaseQuery = query.toLowerCase()
    return this.medicalFolders.filter(folder =>
      folder.num_folder.toLowerCase().includes(lowercaseQuery) ||
      folder.uuid.toLowerCase().includes(lowercaseQuery) ||
      folder.patient_uuid.toLowerCase().includes(lowercaseQuery) ||
      folder.traitement.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Méthodes utilitaires
  getStatusText(statut: number): string {
    switch (statut) {
      case 1: return 'Actif'
      case 2: return 'Archivé'
      case 3: return 'Fermé'
      default: return 'Inconnu'
    }
  }

  getStatusClass(statut: number): string {
    switch (statut) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  private generateUUID(): string {
    return '550e8400-e29b-41d4-a716-' + Math.random().toString(36).substr(2, 12).padStart(12, '0')
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}

export const medicalFolderService = new MedicalFolderService()
