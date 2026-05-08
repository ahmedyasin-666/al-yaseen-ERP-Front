import api from './api'
import type { AccountingPeriod, AccountingPeriodForm } from '@/types/financial'

export const accountingPeriodService = {
    async getAll(fiscalYearUlid: string) {
        const { data } = await api.get(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods`)
        return data as { data: AccountingPeriod[] }
    },

    async show(fiscalYearUlid: string, periodUlid: string) {
        const { data } = await api.get(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods/${periodUlid}`)
        return data as { data: AccountingPeriod }
    },

    async store(fiscalYearUlid: string, payload: AccountingPeriodForm) {
        const { data } = await api.post(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods`, payload)
        return data as { message: string; data: AccountingPeriod }
    },

    async update(
        fiscalYearUlid: string,
        periodUlid: string,
        payload: Partial<AccountingPeriodForm>
    ) {
        const { data } = await api.put(
            `/core/fiscal-years/${fiscalYearUlid}/accounting-periods/${periodUlid}`,
            payload
        )
        return data as { message: string; data: AccountingPeriod }
    },

    async destroy(fiscalYearUlid: string, periodUlid: string) {
        const { data } = await api.delete(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods/${periodUlid}`)
        return data as { message: string }
    },

    async generate(fiscalYearUlid: string) {
        const { data } = await api.post(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods/generate`)
        return data as { message: string; data: AccountingPeriod[] }
    },

    async close(fiscalYearUlid: string, periodUlid: string) {
        const { data } = await api.post(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods/${periodUlid}/close`)
        return data as { message: string; data: AccountingPeriod }
    },

    async reopen(fiscalYearUlid: string, periodUlid: string) {
        const { data } = await api.post(
            `/core/fiscal-years/${fiscalYearUlid}/accounting-periods/${periodUlid}/reopen`
        )
        return data as { message: string; data: AccountingPeriod }
    },

    async lock(fiscalYearUlid: string, periodUlid: string) {
        const { data } = await api.post(`/core/fiscal-years/${fiscalYearUlid}/accounting-periods/${periodUlid}/lock`)
        return data as { message: string; data: AccountingPeriod }
    },
}

