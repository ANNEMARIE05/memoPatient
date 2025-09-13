import type { PaginationParams, PaginatedResponse } from '../types/global'

/**
 * Service de base pour la pagination côté serveur
 * Fournit des utilitaires communs pour tous les services de pagination
 */
export class BasePaginationService {
  /**
   * Génère une réponse paginée standardisée
   */
  protected createPaginatedResponse<T>(
    data: T[],
    params: PaginationParams,
    total: number
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / params.limit)
    const currentPage = params.page

    return {
      data,
      pagination: {
        page: currentPage,
        limit: params.limit,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    }
  }

  /**
   * Applique la recherche sur une liste de données
   */
  protected applySearch<T>(
    data: T[],
    searchQuery: string,
    searchFields: (keyof T)[]
  ): T[] {
    if (!searchQuery) return data

    const searchLower = searchQuery.toLowerCase()
    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        if (value === null || value === undefined) return false
        
        // Gestion des différents types de données
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower)
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchQuery)
        }
        if (typeof value === 'object' && value !== null) {
          // Pour les objets imbriqués, on cherche dans les propriétés de premier niveau
          return Object.values(value).some(val => 
            typeof val === 'string' && val.toLowerCase().includes(searchLower)
          )
        }
        return false
      })
    )
  }

  /**
   * Applique les filtres sur une liste de données
   */
  protected applyFilters<T>(
    data: T[],
    filters: Record<string, any>
  ): T[] {
    if (!filters) return data

    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true
        
        const itemValue = (item as any)[key]
        if (itemValue === undefined || itemValue === null) return false
        
        // Gestion des différents types de filtres
        if (typeof value === 'string') {
          return itemValue.toString().toLowerCase() === value.toLowerCase()
        }
        if (Array.isArray(value)) {
          return value.includes(itemValue)
        }
        return itemValue === value
      })
    })
  }

  /**
   * Applique le tri sur une liste de données
   */
  protected applySorting<T>(
    data: T[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): T[] {
    if (!sortBy) return data

    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, sortBy)
      const bValue = this.getNestedValue(b, sortBy)

      // Gestion des valeurs nulles/undefined
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      // Comparaison selon le type
      let comparison = 0
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  /**
   * Obtient une valeur imbriquée dans un objet
   */
  protected getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  /**
   * Applique la pagination sur une liste de données
   */
  protected applyPagination<T>(
    data: T[],
    page: number,
    limit: number
  ): T[] {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return data.slice(startIndex, endIndex)
  }

  /**
   * Traite une requête de pagination complète
   */
  protected processPaginatedRequest<T>(
    data: T[],
    params: PaginationParams,
    searchFields: (keyof T)[]
  ): PaginatedResponse<T> {
    // 1. Appliquer la recherche
    let filteredData = this.applySearch(data, params.search || '', searchFields)

    // 2. Appliquer les filtres
    filteredData = this.applyFilters(filteredData, params.filters || {})

    // 3. Appliquer le tri
    filteredData = this.applySorting(filteredData, params.sortBy, params.sortOrder)

    // 4. Calculer le total après filtrage
    const total = filteredData.length

    // 5. Appliquer la pagination
    const paginatedData = this.applyPagination(filteredData, params.page, params.limit)

    // 6. Retourner la réponse paginée
    return this.createPaginatedResponse(paginatedData, params, total)
  }

  /**
   * Valide les paramètres de pagination
   */
  protected validatePaginationParams(params: PaginationParams): PaginationParams {
    return {
      page: Math.max(1, params.page || 1),
      limit: Math.min(100, Math.max(1, params.limit || 10)),
      search: params.search?.trim() || undefined,
      filters: params.filters || undefined,
      sortBy: params.sortBy || undefined,
      sortOrder: params.sortOrder || 'asc'
    }
  }
}
