// ================================================================
//  src/services/currencyService.ts — مُحدَّث بإضافة Source Management
//  كل الكود الموجود محفوظ — أضفنا فقط Types + Methods جديدة
// ================================================================
import api from './api'

// ── Types (موجودة — لا تتغير) ─────────────────────────────────────

export interface Currency {
    id: number
    ulid: string
    company_id: number | null
    code: string
    name: string
    name_en: string | null
    symbol: string | null
    decimal_places: number
    is_base_currency: boolean
    exchange_rate: number
    status: 'active' | 'inactive'
    display_name: string
    company_rate?: number | null
    has_override?: boolean
    effective_rate?: number
    rate_source?: RateSource      // ← جديد: المصدر الحالي لهذه العملة
}

export interface CurrencyRate {
    currency_ulid: string
    currency_code: string
    source: RateSource            // ← جديد
    global_rate: number
    company_rate: number | null
    effective_rate: number
    has_override: boolean
    override_date: string | null
}

export interface CurrencyListResponse {
    data: Currency[]
    meta: {
        total: number
        current_page: number
        last_page: number
        per_page: number
    }
}

// ── Types الجديدة ─────────────────────────────────────────────────

export type RateSource = 'manual' | 'system' | 'market'

export interface RateSourceInfo {
    source: RateSource
    label: string
    description: string
    can_edit_rates: boolean      // true فقط عند manual
    can_sync: boolean            // true فقط عند market
}

export interface SyncResult {
    synced_at: string
    updated_count: number
    base_currency: string
}

// ================================================================
//  currencyService
// ================================================================

export const currencyService = {

    // ── COMPANY ENDPOINTS (موجودة) ─────────────────────────────────

    async list(params: Record<string, unknown> = {}): Promise<CurrencyListResponse> {
        const { data } = await api.get('core/currencies', { params })
        return data as CurrencyListResponse
    },

    async dropdown(): Promise<{ data: Currency[] }> {
        const { data } = await api.get('core/currencies/dropdown')
        return data as { data: Currency[] }
    },

    async base(): Promise<{ data: Currency | null }> {
        const { data } = await api.get('core/currencies/base')
        return data as { data: Currency | null }
    },

    async getRate(ulid: string): Promise<{ data: CurrencyRate }> {
        const { data } = await api.get(`core/currencies/${ulid}/rate`)
        return data as { data: CurrencyRate }
    },

    async setRate(ulid: string, rate: number): Promise<{ message: string; data: CurrencyRate }> {
        const { data } = await api.post(`core/currencies/${ulid}/rate`, { rate })
        return data as { message: string; data: CurrencyRate }
    },

    async resetRate(ulid: string): Promise<{ message: string; data: CurrencyRate }> {
        const { data } = await api.delete(`core/currencies/${ulid}/rate`)
        return data as { message: string; data: CurrencyRate }
    },

    // ── SOURCE MANAGEMENT (جديد) ───────────────────────────────────

    /**
     * GET /core/currencies/source
     * المصدر الحالي للشركة
     */
    async getSource(): Promise<{ data: RateSourceInfo }> {
        const { data } = await api.get('core/currencies/source')
        return data as { data: RateSourceInfo }
    },

    /**
     * PUT /core/currencies/source
     * تغيير مصدر سعر الصرف
     */
    async setSource(source: RateSource): Promise<{ message: string; data: RateSourceInfo }> {
        const { data } = await api.put('core/currencies/source', { source })
        return data as { message: string; data: RateSourceInfo }
    },

    /**
     * POST /core/currencies/sync
     * مزامنة يدوية من Open Exchange Rates
     */
    async syncMarket(): Promise<{ message: string; data: SyncResult }> {
        const { data } = await api.post('core/currencies/sync')
        return data as { message: string; data: SyncResult }
    },

    // ── LEGACY / SETUP (موجود — لا يتغير) ─────────────────────────

    async getForSetup(params: Record<string, unknown> = {}): Promise<Currency[]> {
        const { data } = await api.get('core/geography/currencies', { params })
        return data as Currency[]
    },
}

// ================================================================
//  Helpers (موجودة — لا تتغيران)
// ================================================================

export function formatCurrency(
    amount: number,
    currency: Pick<Currency, 'symbol' | 'code' | 'decimal_places'>
): string {
    const formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: currency.decimal_places,
        maximumFractionDigits: currency.decimal_places,
    })
    return currency.symbol ? `${currency.symbol}${formatted}` : `${formatted} ${currency.code}`
}

export function convertAmount(amount: number, fromRate: number, toRate: number): number {
    if (fromRate === toRate) return amount
    const inBase = amount / fromRate
    return Math.round(inBase * toRate * 10000) / 10000
}

// ── Helper جديد: لون المصدر للـ UI ───────────────────────────────

export const rateSourceConfig: Record<RateSource, {
    color: string
    bgColor: string
    icon: string
    labelKey: string
}> = {
    manual: {
        color: '#2563eb',
        bgColor: '#dbeafe',
        icon: 'fas fa-pencil-alt',
        labelKey: 'currencies.source.manual',
    },
    system: {
        color: '#059669',
        bgColor: '#d1fae5',
        icon: 'fas fa-server',
        labelKey: 'currencies.source.system',
    },
    market: {
        color: '#7c3aed',
        bgColor: '#ede9fe',
        icon: 'fas fa-chart-line',
        labelKey: 'currencies.source.market',
    },
}