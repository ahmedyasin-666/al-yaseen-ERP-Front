// src/services/companyService.ts
import api from './api'
import type { CompanySetupPayload, CompanySetupResponse } from '@/types/company'

export interface CompanyUpdatePayload {
    title?: string
    logo?: File | null
    commercial_registeration_number?: string
    email?: string
    mobile?: string
    landline?: string
    phone_code?: string
    country_id?: string | null
    region_id?: string | null
    city_id?: string | null
    address?: string
    industry_id?: string | null
    business_type_id?: string | null
    default_currency_id?: string | null
    vat_rate?: number
    income_tax_rate?: number
    timezone?: string
    date_format?: string
}

export interface CompanyResponse {
    message?: string
    company: {
        ulid: string
        title: string
        email: string
        mobile: string | null
        landline: string | null
        address: string | null
        logo: string | null
        vat_rate: string
        income_tax_rate: string
        timezone: string
        date_format: string
        commercial_registeration_number: string
        industry: { ulid: string; name: string } | null
        business_type: { ulid: string; name: string } | null
        country: { ulid: string; name: string } | null
        region: { ulid: string; name: string } | null
        city: { ulid: string; name: string } | null
        currency: { ulid: string; code: string; symbol: string } | null
    }
}

export const companyService = {

    /**
     * POST /core/companies
     * إنشاء الشركة — wizard
     */
    async setup(payload: CompanySetupPayload): Promise<CompanySetupResponse> {
        const form = new FormData()
        Object.entries(payload).forEach(([k, v]) => {
            if (v === null || v === undefined) return
            form.append(k, v as string | Blob)
        })
        const { data } = await api.post<CompanySetupResponse>('core/companies', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
    },

    /**
     * GET /core/companies/{ulid}/show
     */
    async show(ulid: string): Promise<CompanyResponse> {
        const { data } = await api.get<CompanyResponse>(`core/companies/${ulid}/show`)
        return data
    },

    /**
     * PUT /core/companies/{ulid}/update
     * يُرسل FormData إذا كان هناك logo جديد، وإلا JSON عادي
     */
    async update(ulid: string, payload: CompanyUpdatePayload): Promise<CompanyResponse> {
        if (payload.logo instanceof File) {
            const form = new FormData()
            form.append('_method', 'PUT')
            Object.entries(payload).forEach(([k, v]) => {
                if (v === null || v === undefined) return
                form.append(k, v instanceof File ? v : String(v))
            })
            const { data } = await api.post<CompanyResponse>(
                `core/companies/${ulid}/update`,
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            return data
        }

        // بدون logo: نحذف الحقل ونرسل JSON
        const { logo, ...rest } = payload
        const { data } = await api.put<CompanyResponse>(
            `core/companies/${ulid}/update`,
            rest
        )
        return data
    },
}