import { Survey, SurveyResponse, SurveyField } from '../models/survey';

describe('Survey Backend Models & Data Logic', () => {
    test('should validate survey structure with diverse field types', () => {
        const fields: SurveyField[] = [
            { id: 'f1', label: 'Nome', type: 'text', required: true },
            { id: 'f2', label: 'Opinione', type: 'textarea', required: false },
            { id: 'f3', label: 'Valutazione', type: 'rating', required: true },
            { id: 'f4', label: 'Preferenza', type: 'select', required: true, options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }
        ];

        const survey: Survey = {
            id: 'survey-test-1',
            title: 'Sondaggio Test 2026',
            descriptionMarkdown: '# Benvenuto\nPartecipa al nostro sondaggio.',
            imageUrl: 'https://example.com/cover.jpg',
            attachments: [{ name: 'Regolamento.pdf', url: 'https://example.com/pdf' }],
            allowMultipleSubmissions: false,
            isActive: true,
            fields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        expect(survey.id).toBe('survey-test-1');
        expect(survey.fields.length).toBe(4);
        expect(survey.allowMultipleSubmissions).toBe(false);
        expect(survey.attachments?.[0].name).toBe('Regolamento.pdf');
    });

    test('should validate response payload against required fields', () => {
        const surveyFields: SurveyField[] = [
            { id: 'q1', label: 'Email', type: 'email', required: true },
            { id: 'q2', label: 'Note', type: 'textarea', required: false }
        ];

        const validAnswers: Record<string, any> = { q1: 'test@example.com' };
        const invalidAnswers: Record<string, any> = { q2: 'Solo note' };

        const isAnswerValid = (fields: SurveyField[], ans: Record<string, any>) => {
            for (const f of fields) {
                if (f.required && (!ans[f.id] || ans[f.id] === '')) return false;
            }
            return true;
        };

        expect(isAnswerValid(surveyFields, validAnswers)).toBe(true);
        expect(isAnswerValid(surveyFields, invalidAnswers)).toBe(false);
    });

    test('should format survey response to CSV string properly', () => {
        const survey: Survey = {
            id: 's1',
            title: 'Sondaggio AVIS',
            descriptionMarkdown: 'Markdown',
            allowMultipleSubmissions: true,
            isActive: true,
            fields: [
                { id: 'q1', label: 'Nome "Completo"', type: 'text', required: true },
                { id: 'q2', label: 'Interessi', type: 'multiselect', required: false }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const responses: SurveyResponse[] = [
            {
                id: 'resp-1',
                surveyId: 's1',
                submittedAt: '2026-09-14T10:00:00.000Z',
                userIdentifier: 'user_123',
                answers: { q1: 'Mario Rossi', q2: ['Donazioni', 'Volontariato'] }
            }
        ];

        const escapeCsvCell = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
        const headers = ["ID Risposta", "Data Invio", "Utente", ...survey.fields.map(f => f.label)];
        const row = [
            escapeCsvCell(responses[0].id),
            escapeCsvCell(responses[0].submittedAt),
            escapeCsvCell(responses[0].userIdentifier),
            escapeCsvCell(responses[0].answers.q1),
            escapeCsvCell(responses[0].answers.q2.join(', '))
        ];

        const csvContent = [headers.map(escapeCsvCell).join(','), row.join(',')].join('\n');

        expect(csvContent).toContain('"Mario Rossi"');
        expect(csvContent).toContain('"Donazioni, Volontariato"');
        expect(csvContent).toContain('"Nome ""Completo"""');
    });
});
