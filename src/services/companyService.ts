import api from './api'
import type { CompanySetupPayload, CompanySetupResponse } from '@/types/company'

export const companyService = {

    async setup(payload: CompanySetupPayload): Promise<CompanySetupResponse> {
        // إذا كان هناك لوغو نستخدم FormData وإلا JSON
        if (payload.logo instanceof File) {
            const form = new FormData()
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    form.append(key, value as string | Blob)
                }
            })
            const { data } = await api.post<CompanySetupResponse>(
                'core/companies',
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            return data
        }

        const { data } = await api.post<CompanySetupResponse>('core/companies', payload)
        return data
    },
}