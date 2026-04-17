import { AccessLog, LogAction } from '../../../shared/models/accessLog';

export const logAction = async (action: LogAction, targetId?: string, metadata?: Record<string, any>) => {
    try {
        const entry: Partial<AccessLog> = {
            action,
            targetId,
            metadata
        };

        const response = await fetch('/api/logAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            console.warn('Failed to log action:', action, response.statusText);
        }
    } catch (error) {
        console.error('Error logging action:', error);
    }
};
