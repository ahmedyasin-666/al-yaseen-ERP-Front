import api from './api'
import type { PaymentTerm, PaymentTermForm } from '@/types/partners'

const BASE = '/partners/payment-terms'

export const paymentTermService = {
  async getAll(params: Record<string, unknown> = {}) {
    const { data } = await api.get(BASE, { params })
    return data as {
      data: PaymentTerm[]
      meta: { total: number; current_page: number; last_page: number; per_page: number }
    }
  },

  async show(ulid: string) {
    const { data } = await api.get(`${BASE}/${ulid}/show`)
    return data as { message: string; data: PaymentTerm }
  },

  async store(payload: PaymentTermForm) {
    const { data } = await api.post(BASE, payload)
    return data as { message: string; data: PaymentTerm }
  },

  async update(ulid: string, payload: Partial<PaymentTermForm>) {
    const { data } = await api.put(`${BASE}/${ulid}/update`, payload)
    return data as { message: string; data: PaymentTerm }
  },

  async destroy(ulid: string) {
    const { data } = await api.delete(`${BASE}/${ulid}/destroy`)
    return data as { message: string }
  },
}
