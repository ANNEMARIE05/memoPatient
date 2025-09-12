export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  recordType: 'consultation' | 'examination' | 'prescription' | 'lab_result' | 'imaging' | 'vaccination'
  title: string
  description: string
  date: string
  doctor: string
  diagnosis?: string
  treatment?: string
  prescription?: PrescriptionItem[]
  vitalSigns?: VitalSigns
  attachments?: Attachment[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface PrescriptionItem {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface VitalSigns {
  bloodPressure: string
  heartRate: number
  temperature: number
  weight: number
  height: number
  oxygenSaturation?: number
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'document' | 'pdf'
  url: string
  size: number
  uploadedAt: string
}

export interface MedicalRecordStats {
  totalRecords: number
  recordsThisMonth: number
  consultations: number
  examinations: number
  prescriptions: number
  labResults: number
}

class MedicalRecordService {
  private records: MedicalRecord[] = [
    {
      id: 'MR001',
      patientId: 'P001',
      patientName: 'Marie Dubois',
      recordType: 'consultation',
      title: 'Consultation générale',
      description: 'Consultation de routine pour suivi de l\'hypertension et du diabète',
      date: '2024-12-15',
      doctor: 'Dr. Jean Martin',
      diagnosis: 'Hypertension contrôlée, Diabète type 2 stable',
      treatment: 'Continuation du traitement actuel avec ajustement des doses',
      prescription: [
        {
          id: 'P001',
          medication: 'Metformine',
          dosage: '500mg',
          frequency: '2 fois par jour',
          duration: '3 mois',
          instructions: 'À prendre avec les repas'
        },
        {
          id: 'P002',
          medication: 'Lisinopril',
          dosage: '10mg',
          frequency: '1 fois par jour',
          duration: '3 mois',
          instructions: 'À prendre le matin'
        }
      ],
      vitalSigns: {
        bloodPressure: '130/80',
        heartRate: 72,
        temperature: 36.8,
        weight: 68,
        height: 165,
        oxygenSaturation: 98
      },
      notes: 'Patient coopérative, bon suivi du traitement. RDV dans 3 mois.',
      createdAt: '2024-12-15T10:00:00',
      updatedAt: '2024-12-15T10:00:00'
    },
    {
      id: 'MR002',
      patientId: 'P002',
      patientName: 'Jean Martin',
      recordType: 'examination',
      title: 'Examen pulmonaire',
      description: 'Examen approfondi des poumons suite à des difficultés respiratoires',
      date: '2024-12-10',
      doctor: 'Dr. Sophie Laurent',
      diagnosis: 'Asthme modéré',
      treatment: 'Inhalateur de secours et traitement de fond',
      vitalSigns: {
        bloodPressure: '120/75',
        heartRate: 85,
        temperature: 37.2,
        weight: 75,
        height: 178,
        oxygenSaturation: 94
      },
      notes: 'Patient doit éviter les allergènes connus. Suivi dans 1 mois.',
      createdAt: '2024-12-10T14:30:00',
      updatedAt: '2024-12-10T14:30:00'
    },
    {
      id: 'MR003',
      patientId: 'P003',
      patientName: 'Sophie Laurent',
      recordType: 'lab_result',
      title: 'Analyses sanguines',
      description: 'Bilan sanguin complet avec marqueurs inflammatoires',
      date: '2024-12-08',
      doctor: 'Dr. Pierre Moreau',
      diagnosis: 'Migraines chroniques',
      treatment: 'Traitement préventif et curatif',
      prescription: [
        {
          id: 'P003',
          medication: 'Sumatriptan',
          dosage: '50mg',
          frequency: 'Au besoin',
          duration: '1 mois',
          instructions: 'À prendre dès les premiers signes de migraine'
        }
      ],
      attachments: [
        {
          id: 'ATT001',
          name: 'Bilan_sanguin_Sophie_Laurent.pdf',
          type: 'pdf',
          url: '/attachments/bilan_sanguin_sophie_laurent.pdf',
          size: 245760,
          uploadedAt: '2024-12-08T16:00:00'
        }
      ],
      notes: 'Résultats dans les normes. Traitement préventif à évaluer.',
      createdAt: '2024-12-08T16:00:00',
      updatedAt: '2024-12-08T16:00:00'
    },
    {
      id: 'MR004',
      patientId: 'P004',
      patientName: 'Pierre Moreau',
      recordType: 'consultation',
      title: 'Consultation cardiologie',
      description: 'Suivi cardiologique pour problèmes cardiaques',
      date: '2024-12-05',
      doctor: 'Dr. Claire Bernard',
      diagnosis: 'Insuffisance cardiaque modérée',
      treatment: 'Traitement médicamenteux et recommandations hygiéno-diététiques',
      prescription: [
        {
          id: 'P004',
          medication: 'Furosémide',
          dosage: '40mg',
          frequency: '1 fois par jour',
          duration: '3 mois',
          instructions: 'À prendre le matin'
        },
        {
          id: 'P005',
          medication: 'Bisoprolol',
          dosage: '2.5mg',
          frequency: '1 fois par jour',
          duration: '3 mois',
          instructions: 'À prendre le matin'
        }
      ],
      vitalSigns: {
        bloodPressure: '140/90',
        heartRate: 95,
        temperature: 36.5,
        weight: 82,
        height: 170,
        oxygenSaturation: 96
      },
      notes: 'Patient stable mais nécessite un suivi rapproché. Éviter le sel.',
      createdAt: '2024-12-05T09:15:00',
      updatedAt: '2024-12-05T09:15:00'
    },
    {
      id: 'MR005',
      patientId: 'P005',
      patientName: 'Claire Bernard',
      recordType: 'imaging',
      title: 'Radiographie genou',
      description: 'Radiographie du genou droit suite à une douleur persistante',
      date: '2024-12-12',
      doctor: 'Dr. Michel Durand',
      diagnosis: 'Arthrose du genou droit',
      treatment: 'Anti-inflammatoires et kinésithérapie',
      attachments: [
        {
          id: 'ATT002',
          name: 'Radiographie_genou_droit_Claire_Bernard.jpg',
          type: 'image',
          url: '/attachments/radiographie_genou_claire_bernard.jpg',
          size: 1024000,
          uploadedAt: '2024-12-12T11:30:00'
        }
      ],
      notes: 'Arthrose modérée. Programme de kinésithérapie recommandé.',
      createdAt: '2024-12-12T11:30:00',
      updatedAt: '2024-12-12T11:30:00'
    },
    {
      id: 'MR006',
      patientId: 'P006',
      patientName: 'Michel Durand',
      recordType: 'vaccination',
      title: 'Vaccination grippe',
      description: 'Vaccination antigrippale annuelle',
      date: '2024-12-03',
      doctor: 'Dr. Marie Dubois',
      treatment: 'Vaccin antigrippal administré',
      notes: 'Vaccination bien tolérée. Aucune réaction adverse.',
      createdAt: '2024-12-03T15:45:00',
      updatedAt: '2024-12-03T15:45:00'
    }
  ]

  getAllRecords(): MedicalRecord[] {
    return this.records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getRecordsByPatient(patientId: string): MedicalRecord[] {
    return this.records
      .filter(record => record.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getRecordById(id: string): MedicalRecord | undefined {
    return this.records.find(record => record.id === id)
  }

  getRecordsStats(): MedicalRecordStats {
    const totalRecords = this.records.length
    const recordsThisMonth = this.records.filter(record => {
      const recordDate = new Date(record.date)
      const now = new Date()
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear()
    }).length

    const consultations = this.records.filter(r => r.recordType === 'consultation').length
    const examinations = this.records.filter(r => r.recordType === 'examination').length
    const prescriptions = this.records.filter(r => r.recordType === 'prescription').length
    const labResults = this.records.filter(r => r.recordType === 'lab_result').length

    return {
      totalRecords,
      recordsThisMonth,
      consultations,
      examinations,
      prescriptions,
      labResults
    }
  }

  addRecord(recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): MedicalRecord {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `MR${String(this.records.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.records.push(newRecord)
    return newRecord
  }

  updateRecord(id: string, updates: Partial<MedicalRecord>): MedicalRecord | null {
    const index = this.records.findIndex(r => r.id === id)
    if (index === -1) return null
    
    this.records[index] = {
      ...this.records[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.records[index]
  }

  deleteRecord(id: string): boolean {
    const index = this.records.findIndex(r => r.id === id)
    if (index === -1) return false
    
    this.records.splice(index, 1)
    return true
  }

  searchRecords(query: string): MedicalRecord[] {
    const lowercaseQuery = query.toLowerCase()
    return this.records.filter(record =>
      record.patientName.toLowerCase().includes(lowercaseQuery) ||
      record.title.toLowerCase().includes(lowercaseQuery) ||
      record.description.toLowerCase().includes(lowercaseQuery) ||
      record.doctor.toLowerCase().includes(lowercaseQuery) ||
      record.diagnosis?.toLowerCase().includes(lowercaseQuery) ||
      record.treatment?.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getRecordsByType(type: string): MedicalRecord[] {
    return this.records
      .filter(record => record.recordType === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getRecordsByDoctor(doctor: string): MedicalRecord[] {
    return this.records
      .filter(record => record.doctor.toLowerCase().includes(doctor.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

export const medicalRecordService = new MedicalRecordService()
