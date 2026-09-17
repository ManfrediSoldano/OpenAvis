import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { SurveyExternalPage } from '../components/survey/SurveyExternalPage';
import { fetchSurveyById, submitSurveyResponse } from '../services/surveyService';
import { Survey } from '../types/survey';

jest.mock('../services/surveyService', () => ({
    fetchSurveyById: jest.fn(),
    submitSurveyResponse: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'test-survey' }),
    useNavigate: () => jest.fn()
}), { virtual: true });

jest.mock('react-markdown', () => () => null);

jest.mock('primereact/button', () => ({
    Button: ({ label, onClick, type = 'button' }: any) => (
        <button type={type} onClick={onClick}>{label}</button>
    )
}));

jest.mock('primereact/checkbox', () => ({
    Checkbox: ({ inputId, checked, onChange, required }: any) => (
        <input
            id={inputId}
            type="checkbox"
            checked={checked}
            required={required}
            onChange={(event) => onChange({ checked: event.target.checked })}
        />
    )
}));

jest.mock('primereact/skeleton', () => ({ Skeleton: () => <div /> }));
jest.mock('primereact/avatar', () => ({ Avatar: () => <div /> }));
jest.mock('primereact/toast', () => {
    const React = require('react');
    return {
        Toast: React.forwardRef((_props: any, ref: any) => {
            React.useImperativeHandle(ref, () => ({ show: jest.fn() }));
            return null;
        })
    };
});

const mockedFetchSurveyById = fetchSurveyById as jest.MockedFunction<typeof fetchSurveyById>;
const mockedSubmitSurveyResponse = submitSurveyResponse as jest.MockedFunction<typeof submitSurveyResponse>;

const makeSurvey = (allowMultipleSubmissions: boolean): Survey => ({
    id: 'test-survey',
    title: 'Sondaggio di prova',
    descriptionMarkdown: '',
    allowMultipleSubmissions,
    isActive: true,
    fields: [],
    createdAt: '2026-09-17T00:00:00.000Z',
    updatedAt: '2026-09-17T00:00:00.000Z'
});

const findButton = (container: HTMLElement, label: string) =>
    Array.from(container.querySelectorAll('button')).find(button => button.textContent?.includes(label));

describe('External survey completion flow', () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);

        localStorage.clear();
        localStorage.setItem('openavis_user_id', 'test-user');
        mockedFetchSurveyById.mockReset();
        mockedSubmitSurveyResponse.mockReset();
        mockedSubmitSurveyResponse.mockResolvedValue({ success: true, responseId: 'response-1' });

        HTMLElement.prototype.scrollIntoView = jest.fn();
        window.requestAnimationFrame = (callback: FrameRequestCallback) => {
            callback(0);
            return 1;
        };
    });

    afterEach(async () => {
        await act(async () => root.unmount());
        container.remove();
    });

    const renderSurvey = async () => {
        await act(async () => {
            root.render(<SurveyExternalPage />);
        });
    };

    test('requires privacy consent and resets a repeatable survey', async () => {
        mockedFetchSurveyById.mockResolvedValue(makeSurvey(true));
        await renderSurvey();

        const form = container.querySelector('form');
        const privacyCheckbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]');
        expect(form).not.toBeNull();
        expect(privacyCheckbox).not.toBeNull();

        await act(async () => form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
        expect(mockedSubmitSurveyResponse).not.toHaveBeenCalled();

        await act(async () => privacyCheckbox?.click());
        await act(async () => form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));

        expect(container.textContent).toContain('Grazie per aver completato il sondaggio.');
        expect(mockedSubmitSurveyResponse).toHaveBeenCalledWith('test-survey', 'test-user', {}, true);

        await act(async () => findButton(container, 'Compila di nuovo')?.click());
        expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked).toBe(false);
    });

    test('explains that a one-time survey cannot be completed again', async () => {
        localStorage.setItem('survey_submitted_test-survey', 'true');
        mockedFetchSurveyById.mockResolvedValue(makeSurvey(false));
        await renderSurvey();

        expect(container.textContent).toContain('Grazie per aver completato il sondaggio.');
        expect(container.textContent).toContain('Puoi completare questo sondaggio una volta sola.');
        expect(findButton(container, 'Compila di nuovo')).toBeUndefined();
    });
});
