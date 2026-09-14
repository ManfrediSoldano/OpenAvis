import { Survey, SurveyField } from '../types/survey';

describe('Frontend Survey Data Models & Configurations', () => {
    test('creates and validates Survey model correctly', () => {
        const dummyFields: SurveyField[] = [
            { id: 'f1', label: 'Nome Donatore', type: 'text', required: true },
            { id: 'f2', label: 'Gradimento', type: 'rating', required: false }
        ];

        const survey: Survey = {
            id: 'srv-001',
            title: 'Sondaggio Donazioni 2026',
            descriptionMarkdown: '# Benvenuto',
            allowMultipleSubmissions: true,
            isActive: true,
            fields: dummyFields,
            createdAt: '2026-09-14T00:00:00.000Z',
            updatedAt: '2026-09-14T00:00:00.000Z'
        };

        expect(survey.id).toBe('srv-001');
        expect(survey.title).toContain('Sondaggio');
        expect(survey.fields.length).toBe(2);
        expect(survey.fields[0].required).toBe(true);
    });

    test('validates single submission constraints', () => {
        const surveySingle: Survey = {
            id: 'srv-single',
            title: 'Sondaggio Univoco',
            descriptionMarkdown: 'Monouso',
            allowMultipleSubmissions: false,
            isActive: true,
            fields: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        expect(surveySingle.allowMultipleSubmissions).toBe(false);
    });
});
