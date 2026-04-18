export interface UserCompany {
    ulid: string
    title: string
    slug: string
    commercial_registeration_number: string
    email: string
    mobile: string
    landline: string
    phone_code: string
    address: string
    logo: string | null
    vat_rate: string
    income_tax_rate: string
    date_format: string
    timezone: string
    status: string
    industry: { ulid: string; name: string; name_en: string; description: string | null; status: string } | null
    business_type: { ulid: string; name: string; name_en: string; description: string | null; status: string; industry_id: number } | null
    country: { ulid: string; code: string; name: string; name_en: string; phone_code: string; timezone: string; status: string } | null
    region: { ulid: string; name: string; name_en: string; status: string; country_id: number } | null
    city: { ulid: string; name: string; name_en: string; status: string; country_id: number; region_id: number } | null
    currency: { ulid: string; code: string; name: string; name_en: string; symbol: string; decimal_places: number; exchange_rate: string; is_base_currency: boolean; status: string } | null
    created_at: string
}

// ═══════════════════════════════════════════════
//  بيانات المستخدم كما يرجعها الباك اند
// ═══════════════════════════════════════════════
export interface AuthUser {
    id: string
    first_name: string
    last_name: string
    full_name: string
    email: string
    phone: string
    avatar: string
    status: 'active' | 'inactive' | 'suspended' | 'pending'
    company_id: string | null
    company?: UserCompany | null
    last_login_at: string | null
    roles: string[]
    permissions: string[]
}

// ═══════════════════════════════════════════════
//  ما يُرسَل عند تسجيل الدخول
// ═══════════════════════════════════════════════
export interface LoginPayload {
    email: string
    password: string
    device_name?: string
    company_id?: string
}

// ═══════════════════════════════════════════════
//  ما يُرسَل عند التسجيل
// ═══════════════════════════════════════════════
export interface RegisterPayload {
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
    password_confirmation: string
}

// ═══════════════════════════════════════════════
//  ما يرجع من الباك اند (login & register)
// ═══════════════════════════════════════════════
export interface AuthResponse {
    token: string
    token_type: 'Bearer'
    user: AuthUser
    company_id: string | null
}

// ═══════════════════════════════════════════════
//  شكل أخطاء Laravel Validation
// ═══════════════════════════════════════════════
export interface ValidationErrors {
    message: string
    errors?: Record<string, string[]>
}