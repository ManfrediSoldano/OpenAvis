import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Rating } from 'primereact/rating';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';

import { Survey, SurveyField } from '../../types/survey';
import { fetchSurveyById, submitSurveyResponse } from '../../services/surveyService';
import './SurveyExternalPage.css';

const formatSurveyDate = (createdAt?: string) => {
    if (!createdAt) return null;

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

const getAuthorAvatarUrl = (name: string, avatarUrl?: string) => {
    if (avatarUrl) return avatarUrl;

    const params = new URLSearchParams({
        name,
        background: 'e63946',
        color: 'fff'
    });
    return `https://ui-avatars.com/api/?${params.toString()}`;
};

export const SurveyExternalPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [alreadySubmittedLocal, setAlreadySubmittedLocal] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    const submittedBanner = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!submitted) return;

        // The completed form collapses substantially. Bring its acknowledgement
        // back below the sticky site menu after React has rendered it.
        requestAnimationFrame(() => {
            submittedBanner.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [submitted]);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await fetchSurveyById(id);
                setSurvey(data);

                // Check localStorage for single submission status
                const storedFlag = localStorage.getItem(`survey_submitted_${id}`);
                if (storedFlag && data && !data.allowMultipleSubmissions) {
                    setAlreadySubmittedLocal(true);
                }
            } catch (err: any) {
                console.error("Error loading survey:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleAnswerChange = (fieldId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!survey || !id) return;

        // Validation check for required fields
        for (const field of survey.fields) {
            if (field.required) {
                const val = answers[field.id];
                if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Campo Obbligatorio',
                        detail: `Completa il campo: "${field.label}"`,
                        life: 4000
                    });
                    return;
                }
            }
        }

        setSubmitting(true);
        try {
            // Generate anonymous user token for tracking single submissions
            let userIdentifier = localStorage.getItem('openavis_user_id');
            if (!userIdentifier) {
                userIdentifier = `user_${crypto.randomUUID()}`;
                localStorage.setItem('openavis_user_id', userIdentifier);
            }

            await submitSurveyResponse(id, userIdentifier, answers);

            // Record submission locally
            localStorage.setItem(`survey_submitted_${id}`, 'true');
            setSubmitted(true);

            toast.current?.show({
                severity: 'success',
                summary: 'Grazie!',
                detail: 'La tua risposta è stata inviata con successo.',
                life: 5000
            });
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Errore Invio',
                detail: err.message || 'Impossibile inviare la risposta',
                life: 5000
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderFieldInput = (field: SurveyField) => {
        const val = answers[field.id];

        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
            case 'number':
                return (
                    <InputText 
                        value={val || ''} 
                        onChange={(e) => handleAnswerChange(field.id, e.target.value)} 
                        placeholder={field.placeholder || 'Scrivi la tua risposta...'}
                        className="w-full"
                        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                    />
                );

            case 'textarea':
                return (
                    <InputTextarea 
                        value={val || ''} 
                        onChange={(e) => handleAnswerChange(field.id, e.target.value)} 
                        placeholder={field.placeholder || 'Scrivi la tua risposta...'}
                        rows={4}
                        className="w-full"
                    />
                );

            case 'select':
                return (
                    <Dropdown 
                        value={val} 
                        options={field.options || []} 
                        onChange={(e) => handleAnswerChange(field.id, e.value)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder={field.placeholder || "Seleziona un'opzione"}
                        className="w-full"
                        showClear
                    />
                );

            case 'multiselect':
                return (
                    <MultiSelect 
                        value={val || []} 
                        options={field.options || []} 
                        onChange={(e) => handleAnswerChange(field.id, e.value)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder={field.placeholder || 'Seleziona opzioni'}
                        className="w-full"
                        display="chip"
                    />
                );

            case 'radio':
                return (
                    <div className="flex flex-column gap-2 mt-2">
                        {(field.options || []).map((opt) => (
                            <div key={opt.value} className="flex align-items-center gap-2">
                                <RadioButton 
                                    inputId={`${field.id}_${opt.value}`} 
                                    name={field.id} 
                                    value={opt.value} 
                                    onChange={(e) => handleAnswerChange(field.id, e.value)}
                                    checked={val === opt.value} 
                                />
                                <label htmlFor={`${field.id}_${opt.value}`} className="cursor-pointer">{opt.label}</label>
                            </div>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex flex-column gap-2 mt-2">
                        {(field.options || []).map((opt) => {
                            const currentList: string[] = Array.isArray(val) ? val : [];
                            const isChecked = currentList.includes(opt.value);
                            return (
                                <div key={opt.value} className="flex align-items-center gap-2">
                                    <Checkbox 
                                        inputId={`${field.id}_${opt.value}`} 
                                        value={opt.value} 
                                        onChange={(e) => {
                                            let newList = [...currentList];
                                            if (e.checked) newList.push(opt.value);
                                            else newList = newList.filter(v => v !== opt.value);
                                            handleAnswerChange(field.id, newList);
                                        }}
                                        checked={isChecked} 
                                    />
                                    <label htmlFor={`${field.id}_${opt.value}`} className="cursor-pointer">{opt.label}</label>
                                </div>
                            );
                        })}
                    </div>
                );

            case 'date':
                return (
                    <Calendar 
                        value={val ? new Date(val) : null} 
                        onChange={(e) => handleAnswerChange(field.id, e.value ? e.value.toISOString() : null)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        placeholder="Seleziona data"
                        className="w-full"
                    />
                );

            case 'rating':
                return (
                    <Rating 
                        value={val || 0} 
                        onChange={(e) => handleAnswerChange(field.id, e.value)}
                        cancel={false} 
                        stars={5}
                        className="mt-2 text-yellow-500"
                    />
                );

            default:
                return (
                    <InputText 
                        value={val || ''} 
                        onChange={(e) => handleAnswerChange(field.id, e.target.value)} 
                        className="w-full"
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="survey-external-page">
                <Skeleton width="100%" height="320px" className="mb-4 border-round-xl" />
                <Skeleton width="80%" height="2.5rem" className="mx-auto mb-3" />
                <Skeleton width="40%" height="1.2rem" className="mx-auto mb-5" />
                <Skeleton width="100%" height="150px" className="mb-4" />
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="survey-external-page text-center py-5">
                <i className="pi pi-exclamation-circle text-500 text-6xl mb-3"></i>
                <h2>Sondaggio non trovato</h2>
                <p className="text-secondary mb-4">Il sondaggio richiesto non esiste o è stato disattivato.</p>
                <Button label="Torna alla Home" icon="pi pi-home" onClick={() => navigate('/')} />
            </div>
        );
    }

    const authorName = survey.author?.name || 'AVIS Comunale Merate';
    const publishedDate = formatSurveyDate(survey.createdAt);

    return (
        <div className="survey-external-page">
            <Toast ref={toast} />

            {/* News Cover Header Image */}
            {survey.imageUrl && (
                <img src={survey.imageUrl} alt={survey.title} className="survey-hero-image" />
            )}

            {/* News Article Title & Metadata Header */}
            <header className="survey-news-header">
                <h1 className="survey-news-title">{survey.title}</h1>
                <div className="survey-news-meta">
                    <Avatar 
                        image={getAuthorAvatarUrl(authorName, survey.author?.avatarUrl)}
                        shape="circle" 
                        size="normal" 
                    />
                    <span className="font-bold">{authorName}</span>
                    {publishedDate && <span aria-hidden="true">•</span>}
                    {publishedDate && <time dateTime={survey.createdAt}>{publishedDate}</time>}
                </div>
            </header>

            {/* News Article Markdown Body */}
            {survey.descriptionMarkdown && (
                <div className="survey-markdown-body">
                    <ReactMarkdown>{survey.descriptionMarkdown}</ReactMarkdown>
                </div>
            )}

            {/* Downloadable Attachments Section (PDFs/Photos) */}
            {survey.attachments && survey.attachments.filter(a => a.url).length > 0 && (
                <div className="survey-attachments-box">
                    <div className="survey-attachments-title">
                        <i className="pi pi-paperclip text-primary"></i> Allegati da scaricare:
                    </div>
                    <div>
                        {survey.attachments.filter(a => a.url).map((att, index) => (
                            <a 
                                key={index} 
                                href={att.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="survey-attachment-chip"
                            >
                                <i className="pi pi-file-pdf"></i>
                                <span>{att.name || 'Documento'}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* EMBEDDED SURVEY FORM PANEL */}
            <div className="survey-embedded-panel">
                {!survey.isActive ? (
                    <div className="text-center p-4 text-secondary">
                        <i className="pi pi-lock text-4xl mb-2 text-400"></i>
                        <p className="font-bold text-lg m-0">Questo sondaggio è attualmente chiuso.</p>
                    </div>
                ) : submitted || (alreadySubmittedLocal && !survey.allowMultipleSubmissions) ? (
                    <div ref={submittedBanner} className="survey-submitted-banner" tabIndex={-1}>
                        <i className="pi pi-check-circle survey-submitted-icon"></i>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Risposta Registrata!</h3>
                        <p className="text-slate-600 m-0">
                            Grazie per aver completato il sondaggio. Il tuo contributo è fondamentale per AVIS.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="survey-form">
                        {survey.fields.map((field) => (
                            <div key={field.id} className="survey-field-row">
                                <label className="survey-field-label">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {field.helpText && <span className="survey-field-help">{field.helpText}</span>}
                                <div className="survey-field-input">
                                    {renderFieldInput(field)}
                                </div>
                            </div>
                        ))}

                        <div className="mt-5 text-right">
                            <Button 
                                type="submit" 
                                label="Invia Risposte" 
                                icon="pi pi-send" 
                                severity="danger" 
                                size="large" 
                                loading={submitting} 
                                className="px-5 shadow-2" 
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
