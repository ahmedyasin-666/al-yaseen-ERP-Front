// ═══════════════════════════════════════════════
//  Select Option (للـ MDBSelect)
// ═══════════════════════════════════════════════
export interface SelectOption {
    value: string
    text: string
    secondary?: string
    flag?: string
    disabled?: boolean
    group?: string
}

// ═══════════════════════════════════════════════
//  Geography Types (Raw — من الـ API)
// ═══════════════════════════════════════════════
export interface Country {
    ulid: string
    code: string
    name: string
    name_en: string
    phone_code: string
    currency_code: string
    timezone: string
    status: string
}

export interface Region {
    ulid: string
    name: string
    name_en: string
    status: string
    country_id: number
    country: {
        ulid: string
        code: string
        name: string
        name_en: string
    }
}

export interface City {
    ulid: string
    name: string
    name_en: string
    status: string
    country_id: number
    region_id: number
    country: { ulid: string }
    region: { ulid: string }
}

export interface Currency {
    ulid: string
    code: string
    name: string
    name_en: string
    symbol: string
    decimal_places: number
    exchange_rate: string
    is_base_currency: boolean
    status: string
}

export interface Industry {
    ulid: string
    name: string
    name_en: string
    description: string | null
    status: string
}

export interface BusinessType {
    ulid: string
    name: string
    name_en: string
    description: string | null
    status: string
    industry_id: number
    industry: { ulid: string }
}

// ═══════════════════════════════════════════════
//  Extended SelectOptions (للفلترة في الفرونت)
// ═══════════════════════════════════════════════
export interface RegionOption extends SelectOption {
    countryUlid: string
}

export interface CityOption extends SelectOption {
    regionUlid: string
}

export interface BusinessTypeOption extends SelectOption {
    industryUlid: string
}

// ═══════════════════════════════════════════════
//  Company Setup
// ═══════════════════════════════════════════════
export interface CompanySetupForm {
    title: string
    logo: string | File | null
    commercial_registeration_number: string
    email: string
    phone_code: string
    mobile: string
    landline: string
    country_id: string | null
    region_id: string | null
    city_id: string | null
    address: string
    timezone: string
    industry_id: string | null
    business_type_id: string | null
    default_currency_id: string | null
    vat_rate: number
    income_tax_rate: number
    date_format: string
}

export type CompanySetupPayload = CompanySetupForm & { logo?: File | string | null }

export interface CompanySetupResponse {
    message?: string
    data: {
        id: number | string
        ulid?: string
        title: string
    }
}