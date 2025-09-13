import type { Appointment, PaginationParams, PaginatedResponse, AppointmentStats } from '../types/global'

class AppointmentService {
  private appointments: Appointment[] = [
    {
      uuid: 'APT001',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440001',
      date_edition: '2024-12-16T10:00:00Z',
      motif: 'Consultation de routine',
      statut: 1,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: 'APT002',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440002',
      date_edition: '2024-12-16T14:00:00Z',
      motif: 'Suivi diabète',
      statut: 1,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: 'APT003',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440003',
      date_edition: '2024-12-17T09:00:00Z',
      motif: 'Consultation urgente',
      statut: 2,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: 'APT004',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440004',
      date_edition: '2024-12-17T11:00:00Z',
      motif: 'Contrôle tension',
      statut: 1,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      uuid: 'APT005',
      patient_uuid: '550e8400-e29b-41d4-a716-446655440005',
      date_edition: '2024-12-18T15:00:00Z',
      motif: 'Consultation générale',
      statut: 0,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
  ]

  getAppointments(params: PaginationParams): PaginatedResponse<Appointment> {
    let filteredAppointments = [...this.appointments]
    
    // Filtres
    if (params.filters) {
      // Filtre par date de début
      if (params.filters.startDate) {
        const startDate = new Date(params.filters.startDate)
        filteredAppointments = filteredAppointments.filter(apt => {
          const aptDate = new Date(apt.date_edition)
          return aptDate >= startDate
        })
      }
      
      // Filtre par date de fin
      if (params.filters.endDate) {
        const endDate = new Date(params.filters.endDate)
        endDate.setHours(23, 59, 59, 999) // Fin de journée
        filteredAppointments = filteredAppointments.filter(apt => {
          const aptDate = new Date(apt.date_edition)
          return aptDate <= endDate
        })
      }
      
      // Filtre par statut
      if (params.filters.statut !== undefined) {
        filteredAppointments = filteredAppointments.filter(apt => apt.statut === params.filters!.statut)
      }
      
      // Filtre par patient
      if (params.filters.patient_uuid) {
        filteredAppointments = filteredAppointments.filter(apt => apt.patient_uuid === params.filters!.patient_uuid)
      }
    }
    
    // Tri
    if (params.sortBy) {
      filteredAppointments.sort((a, b) => {
        const aValue = this.getNestedValue(a, params.sortBy!)
        const bValue = this.getNestedValue(b, params.sortBy!)
        
        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }
    
    // Pagination
    const total = filteredAppointments.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedData = filteredAppointments.slice(startIndex, endIndex)
    
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

  getAllAppointments(): Appointment[] {
    return this.appointments
  }

  getAppointmentById(uuid: string): Appointment | undefined {
    return this.appointments.find(appointment => appointment.uuid === uuid)
  }

  getAppointmentsStats(): AppointmentStats {
    const total = this.appointments.length
    const today = new Date().toDateString()
    const todayAppointments = this.appointments.filter(apt => 
      new Date(apt.date_edition).toDateString() === today
    ).length
    
    const thisWeek = this.getWeekAppointments()
    const pending = this.appointments.filter(apt => apt.statut === 0).length
    const cancelled = this.appointments.filter(apt => apt.statut === 3).length

    return {
      total,
      today: todayAppointments,
      thisWeek,
      pending,
      cancelled
    }
  }

  addAppointment(appointmentData: Omit<Appointment, 'uuid' | 'created_at' | 'updated_at' | 'created_user' | 'updated_user'>): Appointment {
    const newAppointment: Appointment = {
      ...appointmentData,
      uuid: `APT${String(this.appointments.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_user: '550e8400-e29b-41d4-a716-446655440000',
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    this.appointments.push(newAppointment)
    return newAppointment
  }

  updateAppointment(uuid: string, updates: Partial<Appointment>): Appointment | null {
    const index = this.appointments.findIndex(apt => apt.uuid === uuid)
    if (index === -1) return null
    
    this.appointments[index] = {
      ...this.appointments[index],
      ...updates,
      updated_at: new Date().toISOString(),
      updated_user: '550e8400-e29b-41d4-a716-446655440000'
    }
    return this.appointments[index]
  }

  deleteAppointment(uuid: string): boolean {
    const index = this.appointments.findIndex(apt => apt.uuid === uuid)
    if (index === -1) return false
    
    this.appointments.splice(index, 1)
    return true
  }

  getStatusText(statut: number): string {
    const statusMap: Record<number, string> = {
      0: 'En attente',
      1: 'Confirmé',
      2: 'En cours',
      3: 'Annulé',
      4: 'Terminé'
    }
    return statusMap[statut] || 'Inconnu'
  }

  getStatusClass(statut: number): string {
    const classMap: Record<number, string> = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-red-100 text-red-800',
      4: 'bg-gray-100 text-gray-800'
    }
    return classMap[statut] || 'bg-gray-100 text-gray-800'
  }

  private getWeekAppointments(): number {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() + 6))
    
    return this.appointments.filter(apt => {
      const aptDate = new Date(apt.date_edition)
      return aptDate >= startOfWeek && aptDate <= endOfWeek
    }).length
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}

export const appointmentService = new AppointmentService()