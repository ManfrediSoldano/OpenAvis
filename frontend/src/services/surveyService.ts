import { Survey, SurveyResponse } from '../types/survey';

export async function fetchSurveys(): Promise<Survey[]> {
    const res = await fetch('/api/getSurveys');
    if (!res.ok) {
        throw new Error(`Impossibile recuperare i sondaggi: ${res.statusText}`);
    }
    return await res.json();
}

export async function fetchSurveyById(id: string): Promise<Survey | null> {
    const res = await fetch(`/api/getSurveyById?id=${encodeURIComponent(id)}`);
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Errore recupero sondaggio: ${res.statusText}`);
    }
    return await res.json();
}

export async function saveSurvey(survey: Partial<Survey>): Promise<Survey> {
    const res = await fetch('/api/saveSurvey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey)
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Errore salvataggio sondaggio: ${errText}`);
    }
    return await res.json();
}

export async function deleteSurvey(id: string): Promise<boolean> {
    const res = await fetch('/api/deleteSurvey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Errore eliminazione sondaggio: ${errText}`);
    }
    const data = await res.json();
    return data.success;
}

export async function submitSurveyResponse(surveyId: string, userIdentifier: string, answers: Record<string, any>): Promise<{ success: boolean; responseId?: string }> {
    const res = await fetch('/api/submitSurveyResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyId, userIdentifier, answers })
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Invio risposte fallito');
    }
    return await res.json();
}

export async function fetchSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    const res = await fetch(`/api/getSurveyResponses?surveyId=${encodeURIComponent(surveyId)}`);
    if (!res.ok) {
        throw new Error(`Errore recupero risposte: ${res.statusText}`);
    }
    return await res.json();
}

export function getExportCsvUrl(surveyId: string): string {
    return `/api/exportSurveyResponses?surveyId=${encodeURIComponent(surveyId)}`;
}
