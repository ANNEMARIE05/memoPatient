export interface Patient {
  id: string
  name: string
  age: number
  gender: 'M' | 'F'
  phone: string
  email: string
  address: string
  dateOfBirth: string
  lastVisit: string
  status: 'Actif' | 'Inactif'
  medicalHistory: string[]
  allergies: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface PatientStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  genderDistribution: {
    male: number
    female: number
  }
  ageGroups: {
    '0-18': number
    '19-35': number
    '36-55': number
    '55+': number
  }
}

class PatientService {
  private patients: Patient[] = [
    {
      id: 'P001',
      name: 'Marie Dubois',
      age: 45,
      gender: 'F',
      phone: '06 12 34 56 78',
      email: 'marie.dubois@email.com',
      address: '123 Rue de la Paix, Paris',
      dateOfBirth: '1979-03-15',
      lastVisit: '2024-12-15',
      status: 'Actif',
      medicalHistory: ['Hypertension', 'Diabète type 2'],
      allergies: ['Pénicilline'],
      emergencyContact: {
        name: 'Pierre Dubois',
        phone: '06 98 76 54 32',
        relationship: 'Époux'
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-12-15'
    },
    {
      id: 'P002',
      name: 'Jean Martin',
      age: 32,
      gender: 'M',
      phone: '06 23 45 67 89',
      email: 'jean.martin@email.com',
      address: '456 Avenue des Champs, Lyon',
      dateOfBirth: '1992-07-22',
      lastVisit: '2024-12-10',
      status: 'Actif',
      medicalHistory: ['Asthme'],
      allergies: ['Aucune'],
      emergencyContact: {
        name: 'Sophie Martin',
        phone: '06 87 65 43 21',
        relationship: 'Épouse'
      },
      createdAt: '2024-02-20',
      updatedAt: '2024-12-10'
    },
    {
      id: 'P003',
      name: 'Sophie Laurent',
      age: 28,
      gender: 'F',
      phone: '06 34 56 78 90',
      email: 'sophie.laurent@email.com',
      address: '789 Boulevard Saint-Germain, Marseille',
      dateOfBirth: '1996-11-08',
      lastVisit: '2024-12-08',
      status: 'Actif',
      medicalHistory: ['Migraines'],
      allergies: ['Aspirine'],
      emergencyContact: {
        name: 'Michel Laurent',
        phone: '06 76 54 32 10',
        relationship: 'Père'
      },
      createdAt: '2024-03-10',
      updatedAt: '2024-12-08'
    },
    {
      id: 'P004',
      name: 'Pierre Moreau',
      age: 55,
      gender: 'M',
      phone: '06 45 67 89 01',
      email: 'pierre.moreau@email.com',
      address: '321 Rue de Rivoli, Toulouse',
      dateOfBirth: '1969-05-12',
      lastVisit: '2024-12-05',
      status: 'Inactif',
      medicalHistory: ['Cholestérol élevé', 'Problèmes cardiaques'],
      allergies: ['Crustacés'],
      emergencyContact: {
        name: 'Claire Moreau',
        phone: '06 65 43 21 09',
        relationship: 'Épouse'
      },
      createdAt: '2024-01-05',
      updatedAt: '2024-12-05'
    },
    {
      id: 'P005',
      name: 'Claire Bernard',
      age: 41,
      gender: 'F',
      phone: '06 56 78 90 12',
      email: 'claire.bernard@email.com',
      address: '654 Place Bellecour, Nice',
      dateOfBirth: '1983-09-30',
      lastVisit: '2024-12-12',
      status: 'Actif',
      medicalHistory: ['Arthrite'],
      allergies: ['Latex'],
      emergencyContact: {
        name: 'Thomas Bernard',
        phone: '06 54 32 10 98',
        relationship: 'Époux'
      },
      createdAt: '2024-02-15',
      updatedAt: '2024-12-12'
    },
    {
      id: 'P006',
      name: 'Michel Durand',
      age: 67,
      gender: 'M',
      phone: '06 67 89 01 23',
      email: 'michel.durand@email.com',
      address: '987 Rue de la République, Bordeaux',
      dateOfBirth: '1957-12-03',
      lastVisit: '2024-12-03',
      status: 'Actif',
      medicalHistory: ['Diabète type 1', 'Hypertension', 'Problèmes rénaux'],
      allergies: ['Pénicilline', 'Sulfamides'],
      emergencyContact: {
        name: 'Françoise Durand',
        phone: '06 43 21 09 87',
        relationship: 'Épouse'
      },
      createdAt: '2024-01-20',
      updatedAt: '2024-12-03'
    }
  ]

  getAllPatients(): Patient[] {
    return this.patients
  }

  getPatientById(id: string): Patient | undefined {
    return this.patients.find(patient => patient.id === id)
  }

  getPatientsStats(): PatientStats {
    const total = this.patients.length
    const active = this.patients.filter(p => p.status === 'Actif').length
    const inactive = this.patients.filter(p => p.status === 'Inactif').length
    
    // Patients nouveaux ce mois (simulation)
    const newThisMonth = 89
    
    const genderDistribution = {
      male: this.patients.filter(p => p.gender === 'M').length,
      female: this.patients.filter(p => p.gender === 'F').length
    }
    
    const ageGroups = {
      '0-18': this.patients.filter(p => p.age <= 18).length,
      '19-35': this.patients.filter(p => p.age >= 19 && p.age <= 35).length,
      '36-55': this.patients.filter(p => p.age >= 36 && p.age <= 55).length,
      '55+': this.patients.filter(p => p.age > 55).length
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

  addPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    const newPatient: Patient = {
      ...patient,
      id: `P${String(this.patients.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    this.patients.push(newPatient)
    return newPatient
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.patients[index] = {
      ...this.patients[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    return this.patients[index]
  }

  deletePatient(id: string): boolean {
    const index = this.patients.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.patients.splice(index, 1)
    return true
  }

  searchPatients(query: string): Patient[] {
    const lowercaseQuery = query.toLowerCase()
    return this.patients.filter(patient =>
      patient.name.toLowerCase().includes(lowercaseQuery) ||
      patient.id.toLowerCase().includes(lowercaseQuery) ||
      patient.phone.includes(query) ||
      patient.email.toLowerCase().includes(lowercaseQuery)
    )
  }
}

export const patientService = new PatientService()
