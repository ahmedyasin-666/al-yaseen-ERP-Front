
import api from '@/services/api'
import type { FiscalYear, FiscalYearForm, FiscalYearMeta, FiscalYearStats } from '@/types/fiscalYear'
 
const BASE = '/core/fiscal-years'
 
export const fiscalYearService = {
 
  // ── GET /core/fiscal-years ──────────────────────────────────
  async getAll(params: Record<string, unknown> = {}) {
    const { data } = await api.get(BASE, { params })
    return data as { data: FiscalYear[]; meta: FiscalYearMeta }
  },
 
  // ── GET /core/fiscal-years/switcher ─────────────────────────
  async getSwitcher() {
    const { data } = await api.get(`${BASE}/switcher`)
    return data as { years: FiscalYear[]; current_id: string | null }
  },
 
  // ── POST /core/fiscal-years ──────────────────────────────────
  async store(payload: FiscalYearForm) {
    const { data } = await api.post(BASE, payload)
    return data as { message: string; data: FiscalYear }
  },
 
  // ── GET /core/fiscal-years/{ulid}/show ───────────────────────
  async show(ulid: string) {
    const { data } = await api.get(`${BASE}/${ulid}/show`)
    return data as { data: FiscalYear; stats: FiscalYearStats }
  },
 
  // ── PUT /core/fiscal-years/{ulid}/update ─────────────────────
  async update(ulid: string, payload: Partial<FiscalYearForm>) {
    const { data } = await api.put(`${BASE}/${ulid}/update`, payload)
    return data as { message: string; data: FiscalYear }
  },
 
  // ── DELETE /core/fiscal-years/{ulid}/destroy ─────────────────
  async destroy(ulid: string) {
    const { data } = await api.delete(`${BASE}/${ulid}/destroy`)
    return data as { message: string }
  },
 
  // ── Status Actions ──────────────────────────────────────────
  async close(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/close`)
    return data as { message: string; data: FiscalYear }
  },
 
  async reopen(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/reopen`)
    return data as { message: string; data: FiscalYear }
  },
 
  async lock(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/lock`)
    return data as { message: string; data: FiscalYear }
  },
 
  async setDefault(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/set-default`)
    return data as { message: string; data: FiscalYear }
  },
 
  async switchYear(ulid: string) {
    const { data } = await api.post(`${BASE}/${ulid}/switch`)
    return data as { message: string; current_year: Record<string, unknown> }
  },
}