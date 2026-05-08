import api from './api'
import type { TaxRate, TaxRateForm, TaxGroup, TaxGroupForm } from '@/types/financial'
import type { PaginationMeta } from '@/types/financial'

export const taxRateService = {
    async getAll(params: Record<string, unknown> = {}) {
        const { data } = await api.get('/financial/tax-rates', { params })
        return data as { data: TaxRate[]; meta?: PaginationMeta }
    },

    async show(ulid: string) {
        const { data } = await api.get(`/financial/tax-rates/${ulid}`)
        return data as { data: TaxRate }
    },

    async store(payload: TaxRateForm) {
        const { data } = await api.post('/financial/tax-rates', payload)
        return data as { message: string; data: TaxRate }
    },

    async update(ulid: string, payload: Partial<TaxRateForm>) {
        const { data } = await api.put(`/financial/tax-rates/${ulid}`, payload)
        return data as { message: string; data: TaxRate }
    },

    async destroy(ulid: string) {
        const { data } = await api.delete(`/financial/tax-rates/${ulid}`)
        return data as { message: string }
    },
}

export const taxGroupService = {
    async getAll(params: Record<string, unknown> = {}) {
        const { data } = await api.get('/financial/tax-groups', { params })
        return data as { data: TaxGroup[]; meta?: PaginationMeta }
    },

    async show(ulid: string) {
        const { data } = await api.get(`/financial/tax-groups/${ulid}`)
        return data as { data: TaxGroup }
    },

    async store(payload: TaxGroupForm) {
        const { data } = await api.post('/financial/tax-groups', payload)
        return data as { message: string; data: TaxGroup }
    },

    async update(ulid: string, payload: Partial<TaxGroupForm>) {
        const { data } = await api.put(`/financial/tax-groups/${ulid}`, payload)
        return data as { message: string; data: TaxGroup }
    },

    async destroy(ulid: string) {
        const { data } = await api.delete(`/financial/tax-groups/${ulid}`)
        return data as { message: string }
    },
}

