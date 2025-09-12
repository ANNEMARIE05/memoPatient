export interface SMS {
  id: string
  recipientId: string
  recipientName: string
  recipientPhone: string
  message: string
  type: 'Rappel RDV' | 'Annulation' | 'Report' | 'Confirmation' | 'Personnalisé'
  status: 'En attente' | 'Envoyé' | 'Livré' | 'Échec'
  sentAt: string
  deliveredAt?: string
  templateId?: string
}

export interface SMSTemplate {
  id: string
  name: string
  type: 'Rappel RDV' | 'Annulation' | 'Report' | 'Confirmation'
  content: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface SMSStats {
  totalSent: number
  delivered: number
  pending: number
  failed: number
  deliveryRate: number
  templatesCount: number
}

class SMSService {
  private templates: SMSTemplate[] = [
    {
      id: 'T001',
      name: 'Rappel RDV',
      type: 'Rappel RDV',
      content: 'Bonjour {{patientName}}, vous avez un rendez-vous le {{appointmentDate}} à {{appointmentTime}}. Merci de confirmer votre présence.',
      variables: ['patientName', 'appointmentDate', 'appointmentTime'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'T002',
      name: 'Annulation',
      type: 'Annulation',
      content: 'Bonjour {{patientName}}, votre rendez-vous du {{appointmentDate}} a été annulé. Nous vous contacterons pour reprogrammer.',
      variables: ['patientName', 'appointmentDate'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'T003',
      name: 'Report',
      type: 'Report',
      content: 'Bonjour {{patientName}}, votre rendez-vous a été reporté au {{newDate}} à {{newTime}}. Nous nous excusons pour ce changement.',
      variables: ['patientName', 'newDate', 'newTime'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'T004',
      name: 'Confirmation',
      type: 'Confirmation',
      content: 'Bonjour {{patientName}}, votre rendez-vous du {{appointmentDate}} à {{appointmentTime}} est confirmé. À bientôt !',
      variables: ['patientName', 'appointmentDate', 'appointmentTime'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ]

  private smsHistory: SMS[] = [
    {
      id: 'SMS001',
      recipientId: 'P001',
      recipientName: 'Marie Dubois',
      recipientPhone: '06 12 34 56 78',
      message: 'Bonjour Marie Dubois, vous avez un rendez-vous le 16/12/2024 à 10:00. Merci de confirmer votre présence.',
      type: 'Rappel RDV',
      status: 'Livré',
      sentAt: '2024-12-15T09:00:00',
      deliveredAt: '2024-12-15T09:01:00',
      templateId: 'T001'
    },
    {
      id: 'SMS002',
      recipientId: 'P002',
      recipientName: 'Jean Martin',
      recipientPhone: '06 23 45 67 89',
      message: 'Bonjour Jean Martin, votre rendez-vous du 16/12/2024 à 14:00 est confirmé. À bientôt !',
      type: 'Confirmation',
      status: 'Livré',
      sentAt: '2024-12-15T10:30:00',
      deliveredAt: '2024-12-15T10:31:00',
      templateId: 'T004'
    },
    {
      id: 'SMS003',
      recipientId: 'P003',
      recipientName: 'Sophie Laurent',
      recipientPhone: '06 34 56 78 90',
      message: 'Bonjour Sophie Laurent, votre rendez-vous a été reporté au 18/12/2024 à 09:00. Nous nous excusons pour ce changement.',
      type: 'Report',
      status: 'En attente',
      sentAt: '2024-12-15T14:00:00',
      templateId: 'T003'
    },
    {
      id: 'SMS004',
      recipientId: 'P004',
      recipientName: 'Pierre Moreau',
      recipientPhone: '06 45 67 89 01',
      message: 'Bonjour Pierre Moreau, votre rendez-vous du 17/12/2024 a été annulé. Nous vous contacterons pour reprogrammer.',
      type: 'Annulation',
      status: 'Échec',
      sentAt: '2024-12-15T16:30:00',
      templateId: 'T002'
    }
  ]

  getTemplates(): SMSTemplate[] {
    return this.templates
  }

  getTemplateById(id: string): SMSTemplate | undefined {
    return this.templates.find(template => template.id === id)
  }

  getSMSHistory(): SMS[] {
    return this.smsHistory.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }

  getSMSStats(): SMSStats {
    const totalSent = this.smsHistory.length
    const delivered = this.smsHistory.filter(sms => sms.status === 'Livré').length
    const pending = this.smsHistory.filter(sms => sms.status === 'En attente').length
    const failed = this.smsHistory.filter(sms => sms.status === 'Échec').length
    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0

    return {
      totalSent,
      delivered,
      pending,
      failed,
      deliveryRate: Math.round(deliveryRate * 10) / 10,
      templatesCount: this.templates.length
    }
  }

  sendSMS(smsData: Omit<SMS, 'id' | 'sentAt' | 'status'>): SMS {
    const newSMS: SMS = {
      ...smsData,
      id: `SMS${String(this.smsHistory.length + 1).padStart(3, '0')}`,
      sentAt: new Date().toISOString(),
      status: 'En attente'
    }

    this.smsHistory.push(newSMS)

    // Simuler l'envoi et la livraison
    setTimeout(() => {
      const index = this.smsHistory.findIndex(sms => sms.id === newSMS.id)
      if (index !== -1) {
        // 95% de taux de livraison simulé
        const isDelivered = Math.random() > 0.05
        this.smsHistory[index].status = isDelivered ? 'Livré' : 'Échec'
        if (isDelivered) {
          this.smsHistory[index].deliveredAt = new Date().toISOString()
        }
      }
    }, 2000)

    return newSMS
  }

  generateMessageFromTemplate(templateId: string, variables: Record<string, string>): string {
    const template = this.getTemplateById(templateId)
    if (!template) return ''

    let message = template.content
    template.variables.forEach(variable => {
      const value = variables[variable] || `{{${variable}}}`
      message = message.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    })

    return message
  }

  resendSMS(smsId: string): boolean {
    const index = this.smsHistory.findIndex(sms => sms.id === smsId)
    if (index === -1) return false

    this.smsHistory[index].status = 'En attente'
    this.smsHistory[index].sentAt = new Date().toISOString()

    // Simuler le réenvoi
    setTimeout(() => {
      if (index < this.smsHistory.length && this.smsHistory[index].id === smsId) {
        const isDelivered = Math.random() > 0.05
        this.smsHistory[index].status = isDelivered ? 'Livré' : 'Échec'
        if (isDelivered) {
          this.smsHistory[index].deliveredAt = new Date().toISOString()
        }
      }
    }, 2000)

    return true
  }
}

export const smsService = new SMSService()
