import type { PaginationParams, PaginatedResponse } from '../types/global'

// Types pour la localisation géographique
export interface GeographicLocation {
  id: string
  name: string
  type: 'country' | 'region' | 'city' | 'district' | 'address'
  parentId?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  postalCode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LocationStats {
  totalLocations: number
  activeLocations: number
  inactiveLocations: number
  countries: number
  regions: number
  cities: number
  districts: number
}

class GeographicLocationService {
  private locations: GeographicLocation[] = [
    // Pays
    {
      id: 'FR',
      name: 'France',
      type: 'country',
      coordinates: { latitude: 46.2276, longitude: 2.2137 },
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'BE',
      name: 'Belgique',
      type: 'country',
      coordinates: { latitude: 50.5039, longitude: 4.4699 },
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'CH',
      name: 'Suisse',
      type: 'country',
      coordinates: { latitude: 46.8182, longitude: 8.2275 },
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Régions françaises
    {
      id: 'IDF',
      name: 'Île-de-France',
      type: 'region',
      parentId: 'FR',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'PACA',
      name: 'Provence-Alpes-Côte d\'Azur',
      type: 'region',
      parentId: 'FR',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'ARA',
      name: 'Auvergne-Rhône-Alpes',
      type: 'region',
      parentId: 'FR',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Villes
    {
      id: 'PARIS',
      name: 'Paris',
      type: 'city',
      parentId: 'IDF',
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
      postalCode: '75001-75020',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'LYON',
      name: 'Lyon',
      type: 'city',
      parentId: 'ARA',
      coordinates: { latitude: 45.7640, longitude: 4.8357 },
      postalCode: '69001-69009',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'MARSEILLE',
      name: 'Marseille',
      type: 'city',
      parentId: 'PACA',
      coordinates: { latitude: 43.2965, longitude: 5.3698 },
      postalCode: '13001-13016',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'TOULOUSE',
      name: 'Toulouse',
      type: 'city',
      parentId: 'OCC',
      coordinates: { latitude: 43.6047, longitude: 1.4442 },
      postalCode: '31000-31555',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Arrondissements de Paris
    {
      id: 'PARIS_01',
      name: '1er arrondissement',
      type: 'district',
      parentId: 'PARIS',
      postalCode: '75001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'PARIS_02',
      name: '2e arrondissement',
      type: 'district',
      parentId: 'PARIS',
      postalCode: '75002',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'PARIS_03',
      name: '3e arrondissement',
      type: 'district',
      parentId: 'PARIS',
      postalCode: '75003',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'NICE',
      name: 'Nice',
      type: 'city',
      parentId: 'PACA',
      coordinates: { latitude: 43.7102, longitude: 7.2620 },
      postalCode: '06000-06300',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'BORDEAUX',
      name: 'Bordeaux',
      type: 'city',
      parentId: 'NAQ',
      coordinates: { latitude: 44.8378, longitude: -0.5792 },
      postalCode: '33000-33800',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'LILLE',
      name: 'Lille',
      type: 'city',
      parentId: 'HDF',
      coordinates: { latitude: 50.6292, longitude: 3.0573 },
      postalCode: '59000-59800',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'NANTES',
      name: 'Nantes',
      type: 'city',
      parentId: 'PDL',
      coordinates: { latitude: 47.2184, longitude: -1.5536 },
      postalCode: '44000-44900',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]

  getLocations(params?: PaginationParams): PaginatedResponse<GeographicLocation> {
    const { page = 1, limit = 10, search = '', filters = {} } = params || {}
    
    let filteredLocations = [...this.locations]

    // Filtrage par recherche
    if (search) {
      filteredLocations = filteredLocations.filter(location =>
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.postalCode?.includes(search)
      )
    }

    // Filtrage par type
    if (filters.type) {
      filteredLocations = filteredLocations.filter(location => location.type === filters.type)
    }

    // Filtrage par statut
    if (filters.isActive !== undefined) {
      filteredLocations = filteredLocations.filter(location => location.isActive === filters.isActive)
    }

    // Tri par nom
    filteredLocations.sort((a, b) => a.name.localeCompare(b.name))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredLocations.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredLocations.length,
        totalPages: Math.ceil(filteredLocations.length / limit),
        hasNext: page < Math.ceil(filteredLocations.length / limit),
        hasPrev: page > 1
      }
    }
  }

  getAllLocations(): GeographicLocation[] {
    return [...this.locations]
  }

  getLocationById(id: string): GeographicLocation | undefined {
    return this.locations.find(location => location.id === id)
  }

  getLocationsByType(type: GeographicLocation['type']): GeographicLocation[] {
    return this.locations.filter(location => location.type === type)
  }

  getLocationsByParent(parentId: string): GeographicLocation[] {
    return this.locations.filter(location => location.parentId === parentId)
  }

  getLocationHierarchy(id: string): GeographicLocation[] {
    const hierarchy: GeographicLocation[] = []
    let currentId: string | undefined = id

    while (currentId) {
      const location = this.getLocationById(currentId)
      if (location) {
        hierarchy.unshift(location)
        currentId = location.parentId
      } else {
        break
      }
    }

    return hierarchy
  }

  getLocationStats(): LocationStats {
    const totalLocations = this.locations.length
    const activeLocations = this.locations.filter(l => l.isActive).length
    const inactiveLocations = totalLocations - activeLocations
    
    const countries = this.locations.filter(l => l.type === 'country').length
    const regions = this.locations.filter(l => l.type === 'region').length
    const cities = this.locations.filter(l => l.type === 'city').length
    const districts = this.locations.filter(l => l.type === 'district').length

    return {
      totalLocations,
      activeLocations,
      inactiveLocations,
      countries,
      regions,
      cities,
      districts
    }
  }

  addLocation(locationData: Omit<GeographicLocation, 'id' | 'createdAt' | 'updatedAt'>): GeographicLocation {
    const newLocation: GeographicLocation = {
      ...locationData,
      id: `LOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.locations.push(newLocation)
    return newLocation
  }

  updateLocation(id: string, updates: Partial<GeographicLocation>): GeographicLocation | null {
    const index = this.locations.findIndex(location => location.id === id)
    if (index === -1) return null

    this.locations[index] = {
      ...this.locations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return this.locations[index]
  }

  deleteLocation(id: string): boolean {
    const index = this.locations.findIndex(location => location.id === id)
    if (index === -1) return false

    // Vérifier s'il y a des enfants
    const hasChildren = this.locations.some(location => location.parentId === id)
    if (hasChildren) {
      throw new Error('Impossible de supprimer un lieu qui contient des sous-lieux')
    }

    this.locations.splice(index, 1)
    return true
  }

  searchLocations(query: string, type?: GeographicLocation['type']): GeographicLocation[] {
    let results = this.locations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.postalCode?.includes(query)
    )

    if (type) {
      results = results.filter(location => location.type === type)
    }

    return results.slice(0, 10) // Limiter à 10 résultats
  }
}

export const geographicLocationService = new GeographicLocationService()
