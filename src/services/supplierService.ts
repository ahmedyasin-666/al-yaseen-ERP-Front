import api from './api'
import type { Supplier, SupplierForm, PartnerBalance, PartnerLedger } from '@/types/partners'

const BASE = '/partners/suppliers'

export const supplierService = {
  async getAll(params: Record<string, unknown> = {}) {
    const { data } = await api.get(BASE, { params })
    return data as {
      data: Supplier[]
      meta: { total: number; current_page: number; last_page: number; per_page: number }
    }
  },

  async getDropdown() {
    const { data } = await api.get(`${BASE}/dropdown`)
    return data as { data: { id: number; ulid: string; code: string; name: string }[] }
  },

  async show(ulid: string) {
    const { data } = await api.get(`${BASE}/${ulid}/show`)
    return data as { message: string; data: Supplier }
  },

  async store(payload: SupplierForm) {
    const { data } = await api.post(BASE, payload)
    return data as { message: string; data: Supplier }
  },

  async update(ulid: string, payload: Partial<SupplierForm>) {
    const { data } = await api.put(`${BASE}/${ulid}/update`, payload)
    return data as { message: string; data: Supplier }
  },

  async destroy(ulid: string) {
    const { data } = await api.delete(`${BASE}/${ulid}/destroy`)
    return data as { message: string }
  },

  async activate(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/activate`)
    return data as { message: string; data: Supplier }
  },

  async deactivate(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/deactivate`)
    return data as { message: string; data: Supplier }
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
