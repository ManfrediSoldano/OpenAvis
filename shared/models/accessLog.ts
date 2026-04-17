export type LogAction = 
    | 'login' 
    | 'logout' 
    | 'donor_update' 
    | 'donor_create' 
    | 'donor_convocation_sent' 
    | 'donor_phase_change' 
    | 'document_print' 
    | 'news_interact'
    | 'page_view';

export interface AccessLog {
    id?: string;
    timestamp: string;
    userId: string;        // The unique ID from Azure (e.g. OID)
    userDetails: string;   // The user email/display name
    action: LogAction;
    targetId?: string;     // ID of the object being acted upon (e.g. donor email, news ID)
    metadata?: Record<string, any>;
}
