export type SurveyFieldType = 
    | 'text' 
    | 'textarea' 
    | 'number' 
    | 'select' 
    | 'multiselect' 
    | 'radio' 
    | 'checkbox' 
    | 'date' 
    | 'rating' 
    | 'file' 
    | 'email' 
    | 'phone';

export interface SurveyFieldOption {
    label: string;
    value: string;
}

export interface SurveyField {
    id: string;
    label: string;
    type: SurveyFieldType;
    required: boolean;
    options?: SurveyFieldOption[];
    placeholder?: string;
    helpText?: string;
}

export interface SurveyAttachment {
    name: string;
    url: string;
}

export interface SurveyAuthor {
    name: string;
    avatarUrl?: string;
}

export interface Survey {
    id: string;
    title: string;
    descriptionMarkdown: string;
    imageUrl?: string;
    attachments?: SurveyAttachment[];
    allowMultipleSubmissions: boolean;
    isActive: boolean;
    fields: SurveyField[];
    createdAt: string;
    updatedAt: string;
    author?: SurveyAuthor;
}

export interface SurveyResponse {
    id: string;
    surveyId: string;
    submittedAt: string;
    userIdentifier?: string;
    answers: Record<string, any>;
    privacyPolicyAccepted?: boolean;
    privacyPolicyAcceptedAt?: string;
}
