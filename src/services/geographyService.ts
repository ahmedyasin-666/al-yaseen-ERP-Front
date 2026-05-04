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
        const { data } = await api.get('core/setup-data')
        // lang يُرسل تلقائياً من الـ interceptor، لكن نحتاجه هنا للـ mapping
        return {
            countries: data.countries.map((c: any): SelectOption => ({
                value: c.ulid,
                text: pick(c, lang),
                secondary: c.code,
            })),
            allRegions: data.regions.map((r: any): RegionOption => ({
                value: r.ulid,
                text: pick(r, lang),
                countryUlid: r.country?.ulid ?? '',
            })),
            allCities: data.cities.map((c: any): CityOption => ({
                value: c.ulid,
                text: pick(c, lang),
                regionUlid: c.region?.ulid ?? '',   // ← تأكد أن الـ Resource يُرجع region.ulid
            })),
            currencies: data.currencies.map((c: any): SelectOption => ({
                value: c.ulid,
                text: pick(c, lang),
                secondary: c.symbol || c.code,
            })),
            industries: data.industries.map((i: any): SelectOption => ({
                value: i.ulid,
                text: pick(i, lang),
            })),
            allBusinessTypes: data.business_types.map((b: any): BusinessTypeOption => ({
                value: b.ulid,
                text: pick(b, lang),
                industryUlid: b.industry?.ulid ?? '',
            })),
        }
    },
}