export type ConvocationStatus = 'not_sent' | 'sent' | 'error';

export interface Donor {
    [key: string]: any;
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    birthDate?: string | Date;
    birthPlace?: string;
    birthProvince?: string;
    taxCode?: string;
    address?: string;
    town?: string;
    domicileAddress?: string;
    domicileTown?: string;
    province?: string;
    phone?: string;
    education?: 'none' | 'primary_school' | 'middle_school' | 'diploma' | 'degree';
    donationPreferences?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    profession?: 'farmer' | 'artisan' | 'merchant' | 'employee' | 'teacher' | 'worker' | 'professional' | 'military' | 'religious' | 'other';
    nonProfessionalCondition?: 'unemployed' | 'student' | 'housewife' | 'pensioner';
    otherAssociations?: string;
    createdAt?: string;

    // New fields
    convocationDate?: string | Date;
    convocationStatus?: ConvocationStatus;
    localAvis?: 'Merate' | 'Brivio' | 'Missaglia';
}
