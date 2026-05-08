import api from './api'
import type {
    SelectOption,
    RegionOption,
    CityOption,
    BusinessTypeOption,
    Currency,
} from '@/types/company'

// ── مساعد لاختيار الاسم حسب اللغة ──
const pick = (item: any, lang: string) =>
    lang === 'ar' ? item.name : (item.name_en || item.name)

// ✅ نوع موحد لكل البيانات
export interface SetupData {
    countries: SelectOption[]
    allRegions: RegionOption[]
    allCities: CityOption[]
    currencies: SelectOption[]
    currenciesRaw?: Currency[]          // ← جديد: البيانات الكاملة للعملات (للاستخدام الداخلي فقط)
    industries: SelectOption[]
    allBusinessTypes: BusinessTypeOption[]
}

// ════════════════════════════════════════════════
export const geographyService = {

    /** كل الدول — تُحمَّل مرة واحدة */
    async getCountries(lang = 'ar'): Promise<SelectOption[]> {
        const { data } = await api.get('core/geography/countries', {
            params: { status: ['active'] },
        })
        return data.data.map((c: any): SelectOption => ({
            value: c.ulid,
            text: pick(c, lang),
            secondary: c.code,
        }))
    },

    /** كل المناطق — تُحمَّل مرة واحدة، الفلترة في الفرونت */
    async getAllRegions(lang = 'ar'): Promise<RegionOption[]> {
        const { data } = await api.get('core/geography/regions', {
            params: { status: ['active'] },
        })
        return data.data.map((r: any): RegionOption => ({
            value: r.ulid,
            text: pick(r, lang),
            countryUlid: r.country?.ulid ?? '',
        }))
    },

    /** كل المدن — تُحمَّل مرة واحدة، الفلترة في الفرونت */
    async getAllCities(lang = 'ar'): Promise<CityOption[]> {
        const { data } = await api.get('core/geography/cities', {
            params: { status: ['active'] },
        })
        return data.data.map((c: any): CityOption => ({
            value: c.ulid,
            text: pick(c, lang),
            regionUlid: c.region?.ulid ?? '',
        }))
    },

    /** كل العملات */
    async getCurrencies(lang = 'ar'): Promise<SelectOption[]> {
        const { data } = await api.get('core/geography/currencies', {
            params: { status: ['active'] },
        })
        return data.data.map((c: any): SelectOption => ({
            value: c.ulid,
            text: pick(c, lang),
            secondary: c.symbol || c.code,
        }))
    },

    /** كل القطاعات */
    async getIndustries(lang = 'ar'): Promise<SelectOption[]> {
        const { data } = await api.get('core/industries', {
            params: { status: ['active'] },
        })
        return data.data.map((i: any): SelectOption => ({
            value: i.ulid,
            text: pick(i, lang),
        }))
    },

    /** كل أنواع الأعمال — تُحمَّل مرة واحدة، الفلترة في الفرونت */
    async getAllBusinessTypes(lang = 'ar'): Promise<BusinessTypeOption[]> {
        const { data } = await api.get('core/business-types', {
            params: { status: ['active'] },
        })
        return data.data.map((b: any): BusinessTypeOption => ({
            value: b.ulid,
            text: pick(b, lang),
            industryUlid: b.industry?.ulid ?? '',
        }))
    },

    /**
    * ✅ جلب كل البيانات في طلب واحد فقط
    */
    async getSetupData(lang = 'ar'): Promise<SetupData> {
        const response = await api.get('core/setup-data')
        console.debug('[setup-data] raw axios response', response)

        const payload = response.data
        // Some endpoints wrap with { data: {...} } while others return flat object.
        const setup = payload?.data ?? payload
        console.debug('[setup-data] parsed payload', {
            hasDataWrapper: Boolean(payload?.data),
            keys: Object.keys(setup ?? {}),
        })

        const countriesRaw = Array.isArray(setup?.countries) ? setup.countries : []
        const regionsRaw = Array.isArray(setup?.regions) ? setup.regions : []
        const citiesRaw = Array.isArray(setup?.cities) ? setup.cities : []
        const currenciesRaw = Array.isArray(setup?.currencies) ? setup.currencies : []
        const industriesRaw = Array.isArray(setup?.industries) ? setup.industries : []
        const businessTypesRaw = Array.isArray(setup?.business_types) ? setup.business_types : []

        console.debug('[setup-data] array diagnostics', {
            countries: countriesRaw.length,
            regions: regionsRaw.length,
            cities: citiesRaw.length,
            currencies: currenciesRaw.length,
            industries: industriesRaw.length,
            business_types: businessTypesRaw.length,
        })

        // lang يُرسل تلقائياً من الـ interceptor، لكن نحتاجه هنا للـ mapping
        return {
            countries: countriesRaw.map((c: any): SelectOption => ({
                value: c.ulid,
                text: pick(c, lang),
                secondary: c.code,
            })),
            allRegions: regionsRaw.map((r: any): RegionOption => ({
                value: r.ulid,
                text: pick(r, lang),
                countryUlid: r.country?.ulid ?? '',
            })),
            allCities: citiesRaw.map((c: any): CityOption => ({
                value: c.ulid,
                text: pick(c, lang),
                regionUlid: c.region?.ulid ?? '',   // ← تأكد أن الـ Resource يُرجع region.ulid
            })),
            currencies: currenciesRaw.map((c: any): SelectOption => ({
                value: c.ulid,
                text: pick(c, lang),
                secondary: c.symbol || c.code,
            })),
            currenciesRaw: currenciesRaw,
            industries: industriesRaw.map((i: any): SelectOption => ({
                value: i.ulid,
                text: pick(i, lang),
            })),
            allBusinessTypes: businessTypesRaw.map((b: any): BusinessTypeOption => ({
                value: b.ulid,
                text: pick(b, lang),
                industryUlid: b.industry?.ulid ?? '',
            })),
        }
    },
}