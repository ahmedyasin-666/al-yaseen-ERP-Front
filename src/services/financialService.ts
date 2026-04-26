// ═══════════════════════════════════════════════
//  src/services/financialService.ts
// ═══════════════════════════════════════════════
import api from './api'
import type {
    Account, AccountForm, AccountDropdown,
    FinancialJournal, JournalForm,
    JournalEntry, EntryForm,
    CostCenter, CostCenterForm,
    TrialBalance, IncomeStatement, BalanceSheet, GeneralLedger,
    PaginationMeta, OpeningBalancePreview,
} from '@/types/financial'

const BASE = '/financial'

// ════════════════════════════════════════════════════════════════
// ACCOUNTS
// ════════════════════════════════════════════════════════════════
export const accountService = {

    async getAll(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/accounts`, { params })
        return data as { data: Account[]; meta: PaginationMeta }
    },

    async getTree(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/accounts/tree`, { params })
        return data.data as Account[]
    },

    async getDropdown(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/accounts/dropdown`, { params })
        return data.data as AccountDropdown[]
    },

    async search(q: string) {
        const { data } = await api.get(`${BASE}/accounts/search`, { params: { q } })
        return data as Account[]
    },

    async show(ulid: string) {
        const { data } = await api.get(`${BASE}/accounts/${ulid}/show`)
        return data as { data: Account; stats: { children_count: number; has_entries: boolean; is_deletable: boolean } }
    },

    async store(payload: AccountForm) {
        const { data } = await api.post(`${BASE}/accounts`, payload)
        return data as { message: string; data: Account }
    },

    async update(ulid: string, payload: Partial<AccountForm>) {
        const { data } = await api.put(`${BASE}/accounts/${ulid}/update`, payload)
        return data as { message: string; data: Account }
    },

    async destroy(ulid: string) {
        const { data } = await api.delete(`${BASE}/accounts/${ulid}/destroy`)
        return data as { message: string }
    },

    async activate(ulid: string) {
        const { data } = await api.post(`${BASE}/accounts/${ulid}/activate`)
        return data as { message: string; data: Account }
    },

    async deactivate(ulid: string) {
        const { data } = await api.post(`${BASE}/accounts/${ulid}/deactivate`)
        return data as { message: string; data: Account }
    },

    async toggleStatus(ulid: string) {
        const { data } = await api.post(`${BASE}/accounts/${ulid}/toggle-status`)
        return data as { message: string; data: Account }
    },

    async getBalance(ulid: string, params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/accounts/${ulid}/balance`, { params })
        return data as { data: Record<string, unknown> }
    },

    async getLedger(ulid: string, params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/accounts/${ulid}/ledger`, { params })
        return data as { data: GeneralLedger }
    },

    async getChildren(ulid: string) {
        const { data } = await api.get(`${BASE}/accounts/${ulid}/children`)
        return data as Account[]
    },
}

// ════════════════════════════════════════════════════════════════
// FINANCIAL JOURNALS
// ════════════════════════════════════════════════════════════════
export const journalService = {

    async getAll(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/journals`, { params })
        return data as { data: FinancialJournal[]; meta: PaginationMeta }
    },

    async getDropdown() {
        const { data } = await api.get(`${BASE}/journals/dropdown`)
        return data.data as FinancialJournal[]
    },

    async show(ulid: string) {
        const { data } = await api.get(`${BASE}/journals/${ulid}/show`)
        return data as { data: FinancialJournal }
    },

    async store(payload: JournalForm) {
        const { data } = await api.post(`${BASE}/journals`, payload)
        return data as { message: string; data: FinancialJournal }
    },

    async update(ulid: string, payload: Partial<JournalForm>) {
        const { data } = await api.put(`${BASE}/journals/${ulid}/update`, payload)
        return data as { message: string; data: FinancialJournal }
    },

    async destroy(ulid: string) {
        const { data } = await api.delete(`${BASE}/journals/${ulid}/destroy`)
        return data as { message: string }
    },
}

// ════════════════════════════════════════════════════════════════
// JOURNAL ENTRIES
// ════════════════════════════════════════════════════════════════
export const entryService = {

    async getAll(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/entries`, { params })
        return data as { data: JournalEntry[]; meta: PaginationMeta }
    },

    async show(ulid: string) {
        const { data } = await api.get(`${BASE}/entries/${ulid}/show`)
        return data as { data: JournalEntry; stats: Record<string, unknown> }
    },

    async store(payload: EntryForm) {
        const { data } = await api.post(`${BASE}/entries`, payload)
        return data as { message: string; data: JournalEntry }
    },

    async update(ulid: string, payload: Partial<EntryForm>) {
        const { data } = await api.put(`${BASE}/entries/${ulid}/update`, payload)
        return data as { message: string; data: JournalEntry }
    },

    async destroy(ulid: string) {
        const { data } = await api.delete(`${BASE}/entries/${ulid}/destroy`)
        return data as { message: string }
    },

    async post(ulid: string) {
        const { data } = await api.post(`${BASE}/entries/${ulid}/post`)
        return data as { message: string; data: JournalEntry }
    },

    async cancel(ulid: string) {
        const { data } = await api.post(`${BASE}/entries/${ulid}/cancel`)
        return data as { message: string; data: JournalEntry }
    },
}

// ════════════════════════════════════════════════════════════════
// COST CENTERS
// ════════════════════════════════════════════════════════════════
export const costCenterService = {

    async getAll(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/cost-centers`, { params })
        return data as { data: CostCenter[]; meta: PaginationMeta }
    },

    async getTree(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/cost-centers/tree`, { params })
        return data as CostCenter[]
    },

    async getDropdown(params: Record<string, unknown> = {}) {
        const { data } = await api.get(`${BASE}/cost-centers/dropdown`, { params })
        return data.data as CostCenter[]
    },

    async show(ulid: string) {
        const { data } = await api.get(`${BASE}/cost-centers/${ulid}/show`)
        return data as { data: CostCenter; stats: { children_count: number; lines_count: number; is_deletable: boolean } }
    },

    async store(payload: CostCenterForm) {
        const { data } = await api.post(`${BASE}/cost-centers`, payload)
        return data as { message: string; data: CostCenter }
    },

    async update(ulid: string, payload: Partial<CostCenterForm>) {
        const { data } = await api.put(`${BASE}/cost-centers/${ulid}/update`, payload)
        return data as { message: string; data: CostCenter }
    },

    async destroy(ulid: string) {
        const { data } = await api.delete(`${BASE}/cost-centers/${ulid}/destroy`)
        return data as { message: string }
    },

    async activate(ulid: string) {
        const { data } = await api.post(`${BASE}/cost-centers/${ulid}/activate`)
        return data as { message: string; data: CostCenter }
    },

    async deactivate(ulid: string) {
        const { data } = await api.post(`${BASE}/cost-centers/${ulid}/deactivate`)
        return data as { message: string; data: CostCenter }
    },
}

// ════════════════════════════════════════════════════════════════
// REPORTS
// ════════════════════════════════════════════════════════════════
export const reportService = {

    async getTrialBalance(params: Record<string, unknown>) {
        const { data } = await api.get(`${BASE}/reports/trial-balance`, { params })
        return data as { data: TrialBalance }
    },

    async getGeneralLedger(params: Record<string, unknown>) {
        const { data } = await api.get(`${BASE}/reports/general-ledger`, { params })
        return data as { data: GeneralLedger }
    },

    async getIncomeStatement(params: Record<string, unknown>) {
        const { data } = await api.get(`${BASE}/reports/income-statement`, { params })
        return data as { data: IncomeStatement }
    },

    async getBalanceSheet(params: Record<string, unknown>) {
        const { data } = await api.get(`${BASE}/reports/balance-sheet`, { params })
        return data as { data: BalanceSheet }
    },
}

// ════════════════════════════════════════════════════════════════
// OPENING BALANCE
// ════════════════════════════════════════════════════════════════
export const openingBalanceService = {

    async preview(fiscalYearId: string) {
        const { data } = await api.get(`${BASE}/opening-balance/preview`, {
            params: { fiscal_year_id: fiscalYearId },
        })
        return data as { data: OpeningBalancePreview }
    },

    async generate(fiscalYearId: string) {
        const { data } = await api.post(`${BASE}/opening-balance/generate`, null, {
            params: { fiscal_year_id: fiscalYearId },
        })
        return data as { message: string; data: JournalEntry }
    },

    async destroy(fiscalYearId: string) {
        const { data } = await api.delete(`${BASE}/opening-balance`, {
            params: { fiscal_year_id: fiscalYearId },
        })
        return data as { message: string }
    },
}

// ════════════════════════════════════════════════════════════════
// YEAR-END CLOSING
// ════════════════════════════════════════════════════════════════
export const yearEndService = {

    async preview(fiscalYearId: string, retainedEarningsUlid: string) {
        const { data } = await api.get(`${BASE}/year-end/preview`, {
            params: { fiscal_year_id: fiscalYearId, retained_earnings_account_ulid: retainedEarningsUlid },
        })
        return data as { data: Record<string, unknown> }
    },

    async execute(fiscalYearId: string, payload: {
        retained_earnings_account_ulid: string
        carry_forward_to_new_year?: boolean
        new_fiscal_year_ulid?: string
    }) {
        const { data } = await api.post(`${BASE}/year-end/execute`, payload, {
            params: { fiscal_year_id: fiscalYearId },
        })
        return data as { message: string; closing_entry: JournalEntry; fiscal_year: Record<string, unknown>; carry_forward: Record<string, unknown> | null }
    },

    async carryForward(fiscalYearId: string, newFiscalYearUlid: string) {
        const { data } = await api.post(`${BASE}/year-end/carry-forward`, {
            new_fiscal_year_ulid: newFiscalYearUlid,
        }, {
            params: { fiscal_year_id: fiscalYearId },
        })
        return data as { message: string; data: Record<string, unknown> }
    },
}