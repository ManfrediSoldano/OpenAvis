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
    taxCode?: string;
    address?: string;
    town?: string;
    phone?: string;
    education?: string;
    donationPreferences?: string;
    profession?: string;
    otherAssociations?: string;
    createdAt?: string;

    // New fields
    convocationDate?: string | Date;
    convocationStatus?: ConvocationStatus;
    localAvis?: 'Merate' | 'Brivio' | 'Missaglia';
}
