import api from './api'
import type { Customer, CustomerForm, PartnerBalance, PartnerLedger } from '@/types/partners'

const BASE = '/partners/customers'

export const customerService = {
  async getAll(params: Record<string, unknown> = {}) {
    const { data } = await api.get(BASE, { params })
    return data as {
      data: Customer[]
      meta: { total: number; current_page: number; last_page: number; per_page: number }
    }
  },

  async getDropdown() {
    const { data } = await api.get(`${BASE}/dropdown`)
    return data as { data: { id: number; ulid: string; code: string; name: string }[] }
  },

  async show(ulid: string) {
    const { data } = await api.get(`${BASE}/${ulid}/show`)
    return data as { message: string; data: Customer }
  },

  async store(payload: CustomerForm) {
    const { data } = await api.post(BASE, payload)
    return data as { message: string; data: Customer }
  },

  async update(ulid: string, payload: Partial<CustomerForm>) {
    const { data } = await api.put(`${BASE}/${ulid}/update`, payload)
    return data as { message: string; data: Customer }
  },

  async destroy(ulid: string) {
    const { data } = await api.delete(`${BASE}/${ulid}/destroy`)
    return data as { message: string }
  },

  async activate(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/activate`)
    return data as { message: string; data: Customer }
  },

  async deactivate(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/deactivate`)
    return data as { message: string; data: Customer }
  },

  async getBalance(ulid: string, params: Record<string, unknown> = {}) {
    const { data } = await api.get(`${BASE}/${ulid}/balance`, { params })
    return data as { message: string; data: PartnerBalance }
  },

  async getLedger(ulid: string, params: Record<string, unknown> = {}) {
    const { data } = await api.get(`${BASE}/${ulid}/ledger`, { params })
    return data as { message: string; data: PartnerLedger }
  },
}
