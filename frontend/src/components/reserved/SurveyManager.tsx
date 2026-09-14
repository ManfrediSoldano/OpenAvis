import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabView, TabPanel } from 'primereact/tabview';
import ReactMarkdown from 'react-markdown';

import { Survey, SurveyField, SurveyFieldType, SurveyResponse } from '../../types/survey';
import { fetchSurveys, saveSurvey, deleteSurvey, fetchSurveyResponses, getExportCsvUrl } from '../../services/surveyService';
import './SurveyManager.css';

interface SurveyManagerProps {
    userEmail?: string;
}

const FIELD_TYPE_OPTIONS: { label: string; value: SurveyFieldType; icon: string }[] = [
    { label: 'Testo Breve', value: 'text', icon: 'pi pi-pencil' },
    { label: 'Testo Esteso (Paragrafo)', value: 'textarea', icon: 'pi pi-align-left' },
    { label: 'Numero', value: 'number', icon: 'pi pi-hashtag' },
    { label: 'Menu a Discesa (Select)', value: 'select', icon: 'pi pi-chevron-down' },
    { label: 'Scelta Multipla (Multiselect)', value: 'multiselect', icon: 'pi pi-list' },
    { label: 'Opzione Singola (Radio)', value: 'radio', icon: 'pi pi-circle-fill' },
    { label: 'Caselle di Controllo (Checkbox)', value: 'checkbox', icon: 'pi pi-check-square' },
    { label: 'Data', value: 'date', icon: 'pi pi-calendar' },
    { label: 'Valutazione (Stelle)', value: 'rating', icon: 'pi pi-star' },
    { label: 'Email', value: 'email', icon: 'pi pi-envelope' },
    { label: 'Telefono', value: 'phone', icon: 'pi pi-phone' }
];

export const SurveyManager: React.FC<SurveyManagerProps> = ({ userEmail }) => {
    const [viewMode, setViewMode] = useState<'list' | 'editor' | 'analytics'>('list');
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    
    // Active survey being edited or viewed
    const [editingSurvey, setEditingSurvey] = useState<Partial<Survey>>({});
    
    // Analytics view states
    const [analyticsSurvey, setAnalyticsSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [loadingResponses, setLoadingResponses] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const toast = useRef<Toast>(null);

    const loadSurveysList = async () => {
        setLoading(true);
        try {
            const data = await fetchSurveys();
            setSurveys(data);
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Errore Caricamento',
                detail: err.message || 'Impossibile caricare i sondaggi'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSurveysList();
    }, []);

    const handleCreateNew = () => {
        setEditingSurvey({
            title: '',
            descriptionMarkdown: '',
            imageUrl: '',
            attachments: [],
            allowMultipleSubmissions: true,
            isActive: true,
            fields: [
                {
                    id: crypto.randomUUID(),
                    label: 'Nome e Cognome',
                    type: 'text',
                    required: true,
                    placeholder: 'Inserisci il tuo nome'
                }
            ]
        });
        setViewMode('editor');
    };

    const handleEdit = (survey: Survey) => {
        setEditingSurvey(JSON.parse(JSON.stringify(survey)));
        setViewMode('editor');
    };

    const handleOpenAnalytics = async (survey: Survey) => {
        setAnalyticsSurvey(survey);
        setViewMode('analytics');
        setLoadingResponses(true);
        try {
            const resData = await fetchSurveyResponses(survey.id);
            setResponses(resData);
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Errore Risposte',
                detail: err.message || 'Impossibile caricare le risposte'
            });
        } finally {
            setLoadingResponses(false);
        }
    };

    const handleDelete = (survey: Survey) => {
        confirmDialog({
            message: `Sei sicuro di voler eliminare il sondaggio "${survey.title}"?`,
            header: 'Conferma Eliminazione',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteSurvey(survey.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Eliminato',
                        detail: 'Sondaggio eliminato con successo'
                    });
                    loadSurveysList();
                } catch (err: any) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Errore Eliminazione',
                        detail: err.message
                    });
                }
            }
        });
    };

    const handleToggleActive = async (survey: Survey, activeStatus: boolean) => {
        try {
            await saveSurvey({ ...survey, isActive: activeStatus });
            toast.current?.show({
                severity: 'info',
                summary: 'Stato Aggiornato',
                detail: `Sondaggio ${activeStatus ? 'attivato' : 'disattivato'}`
            });
            loadSurveysList();
        } catch (err: any) {
            toast.current?.show({ severity: 'error', summary: 'Errore', detail: err.message });
        }
    };

    const handleSaveSurvey = async () => {
        if (!editingSurvey.title?.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Attenzione', detail: 'Inserisci il titolo del sondaggio' });
            return;
        }
        if (!editingSurvey.fields || editingSurvey.fields.length === 0) {
            toast.current?.show({ severity: 'warn', summary: 'Attenzione', detail: 'Aggiungi almeno un campo al sondaggio' });
            return;
        }

        setSaving(true);
        try {
            await saveSurvey(editingSurvey);
            toast.current?.show({
                severity: 'success',
                summary: 'Salvato',
                detail: 'Sondaggio salvato con successo'
            });
            setViewMode('list');
            loadSurveysList();
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Errore Salvataggio',
                detail: err.message
            });
        } finally {
            setSaving(false);
        }
    };

    const addField = () => {
        const newField: SurveyField = {
            id: crypto.randomUUID(),
            label: 'Nuova Domanda',
            type: 'text',
            required: false,
            placeholder: ''
        };
        setEditingSurvey(prev => ({
            ...prev,
            fields: [...(prev.fields || []), newField]
        }));
    };

    const updateField = (index: number, updatedProps: Partial<SurveyField>) => {
        setEditingSurvey(prev => {
            const fields = [...(prev.fields || [])];
            fields[index] = { ...fields[index], ...updatedProps };
            return { ...prev, fields };
        });
    };

    const removeField = (index: number) => {
        setEditingSurvey(prev => {
            const fields = [...(prev.fields || [])];
            fields.splice(index, 1);
            return { ...prev, fields };
        });
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        setEditingSurvey(prev => {
            const fields = [...(prev.fields || [])];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= fields.length) return prev;
            const temp = fields[index];
            fields[index] = fields[targetIndex];
            fields[targetIndex] = temp;
            return { ...prev, fields };
        });
    };

    const copySurveyLink = (surveyId: string) => {
        const url = `${window.location.origin}/survey/${surveyId}`;
        navigator.clipboard.writeText(url);
        toast.current?.show({
            severity: 'success',
            summary: 'Link Copiato',
            detail: 'URL del sondaggio copiato negli appunti'
        });
    };

    // Filter responses for data analytics table
    const filteredResponses = responses.filter(resp => {
        if (!globalFilter.trim()) return true;
        const query = globalFilter.toLowerCase();
        if (resp.userIdentifier?.toLowerCase().includes(query)) return true;
        if (resp.submittedAt.toLowerCase().includes(query)) return true;
        return Object.values(resp.answers || {}).some(val => 
            String(val).toLowerCase().includes(query)
        );
    });

    return (
        <div className="survey-manager-container">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Top Navigation Bar */}
            <div className="survey-top-bar">
                <div className="flex align-items-center gap-3">
                    <i className="pi pi-file-edit text-2xl text-primary"></i>
                    <div>
                        <h2 className="text-xl font-bold m-0">Gestione Sondaggi & Form</h2>
                        <span className="text-sm text-secondary">Crea sondaggi, gestisci domande e visualizza dati analitici</span>
                    </div>
                </div>
                <div className="survey-nav-tabs">
                    <Button 
                        label="Sondaggi" 
                        icon="pi pi-list" 
                        className={`survey-nav-btn ${viewMode === 'list' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'}`}
                        onClick={() => setViewMode('list')}
                    />
                    <Button 
                        label="Nuovo Sondaggio" 
                        icon="pi pi-plus" 
                        severity="success"
                        className="survey-nav-btn"
                        onClick={handleCreateNew}
                    />
                </div>
            </div>

            {/* PANEL 1: SURVEY DIRECTORY LIST */}
            {viewMode === 'list' && (
                <div className="survey-panel-card">
                    <div className="section-header-row">
                        <h3 className="section-header-title">
                            <i className="pi pi-table text-primary"></i> Tutti i Sondaggi
                        </h3>
                        <Button icon="pi pi-refresh" rounded text onClick={loadSurveysList} loading={loading} tooltip="Aggiorna Elenco" />
                    </div>

                    {loading ? (
                        <div className="flex justify-content-center p-5">
                            <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                        </div>
                    ) : (
                        <DataTable 
                            value={surveys} 
                            paginator 
                            rows={10} 
                            emptyMessage="Nessun sondaggio trovato. Clicca su 'Nuovo Sondaggio' per crearne uno."
                            className="p-datatable-sm shadow-1 border-round overflow-hidden"
                        >
                            <Column field="title" header="Titolo" sortable body={(r: Survey) => <b>{r.title}</b>} />
                            <Column header="Campi" body={(r: Survey) => <Tag value={`${r.fields?.length || 0} domande`} severity="info" />} />
                            <Column header="Stato" body={(r: Survey) => (
                                <div className="flex align-items-center gap-2">
                                    <InputSwitch checked={r.isActive} onChange={(e) => handleToggleActive(r, e.value || false)} />
                                    <Tag severity={r.isActive ? 'success' : 'secondary'} value={r.isActive ? 'Attivo' : 'Bozza'} />
                                </div>
                            )} />
                            <Column field="createdAt" header="Data Creazione" body={(r: Survey) => r.createdAt ? new Date(r.createdAt).toLocaleDateString('it-IT') : '-'} sortable />
                            <Column header="Azioni" style={{ width: '220px' }} body={(r: Survey) => (
                                <div className="flex gap-2">
                                    <Button icon="pi pi-pencil" rounded text severity="secondary" onClick={() => handleEdit(r)} tooltip="Modifica" />
                                    <Button icon="pi pi-chart-bar" rounded text severity="info" onClick={() => handleOpenAnalytics(r)} tooltip="Visualizza Dati" />
                                    <Button icon="pi pi-link" rounded text severity="help" onClick={() => copySurveyLink(r.id)} tooltip="Copia Link Esterno" />
                                    <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(r)} tooltip="Elimina" />
                                </div>
                            )} />
                        </DataTable>
                    )}
                </div>
            )}

            {/* PANEL 2: SURVEY BUILDER / EDITOR */}
            {viewMode === 'editor' && (
                <div className="survey-panel-card">
                    <div className="section-header-row">
                        <h3 className="section-header-title">
                            <i className="pi pi-cog text-primary"></i> 
                            {editingSurvey.id ? 'Modifica Sondaggio' : 'Crea Nuovo Sondaggio'}
                        </h3>
                        <div className="flex gap-2">
                            <Button label="Annulla" icon="pi pi-times" severity="secondary" text onClick={() => setViewMode('list')} />
                            <Button label="Salva Sondaggio" icon="pi pi-check" severity="success" onClick={handleSaveSurvey} loading={saving} />
                        </div>
                    </div>

                    <TabView>
                        <TabPanel header="Informazioni & Contenuto News" leftIcon="pi pi-info-circle mr-2">
                            <div className="grid p-fluid mt-2">
                                <div className="col-12 mb-3">
                                    <label className="font-bold block mb-2">Titolo Sondaggio / Notizia *</label>
                                    <InputText 
                                        value={editingSurvey.title || ''} 
                                        onChange={(e) => setEditingSurvey(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Es. Sondaggio Soddisfazione Donatori 2026" 
                                    />
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <label className="font-bold block mb-2">URL Immagine di Copertina</label>
                                    <InputText 
                                        value={editingSurvey.imageUrl || ''} 
                                        onChange={(e) => setEditingSurvey(prev => ({ ...prev, imageUrl: e.target.value }))}
                                        placeholder="https://..." 
                                    />
                                </div>

                                <div className="col-12 md:col-6 mb-3">
                                    <label className="font-bold block mb-2">Impostazioni Compilazione</label>
                                    <div className="flex align-items-center gap-3 mt-2">
                                        <InputSwitch 
                                            checked={editingSurvey.allowMultipleSubmissions ?? true} 
                                            onChange={(e) => setEditingSurvey(prev => ({ ...prev, allowMultipleSubmissions: e.value || false }))} 
                                        />
                                        <span>Consenti risposte multiple da parte dello stesso utente</span>
                                    </div>
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="font-bold block mb-2">Descrizione / Articolo Markdown</label>
                                    <InputTextarea 
                                        value={editingSurvey.descriptionMarkdown || ''} 
                                        onChange={(e) => setEditingSurvey(prev => ({ ...prev, descriptionMarkdown: e.target.value }))}
                                        rows={6} 
                                        placeholder="Scrivi qui il contenuto in Markdown che accompagnerà il sondaggio (stile pagina news)..." 
                                    />
                                    {editingSurvey.descriptionMarkdown && (
                                        <div className="mt-2">
                                            <span className="text-xs font-bold text-secondary">Anteprima Markdown:</span>
                                            <div className="markdown-preview-box mt-1">
                                                <ReactMarkdown>{editingSurvey.descriptionMarkdown}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Downloadable Attachments */}
                                <div className="col-12 mb-3">
                                    <div className="flex justify-content-between align-items-center mb-2">
                                        <label className="font-bold">Allegati da scaricare (PDF / Immagini)</label>
                                        <Button 
                                            label="Aggiungi Allegato" 
                                            icon="pi pi-plus" 
                                            size="small" 
                                            text 
                                            onClick={() => {
                                                const atts = editingSurvey.attachments || [];
                                                setEditingSurvey(prev => ({ ...prev, attachments: [...atts, { name: '', url: '' }] }));
                                            }} 
                                        />
                                    </div>
                                    {(editingSurvey.attachments || []).map((att, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2 align-items-center">
                                            <InputText 
                                                placeholder="Nome File (es. Modulo PDF)" 
                                                value={att.name} 
                                                onChange={(e) => {
                                                    const atts = [...(editingSurvey.attachments || [])];
                                                    atts[idx].name = e.target.value;
                                                    setEditingSurvey(prev => ({ ...prev, attachments: atts }));
                                                }}
                                                className="w-5" 
                                            />
                                            <InputText 
                                                placeholder="URL File (es. https://...)" 
                                                value={att.url} 
                                                onChange={(e) => {
                                                    const atts = [...(editingSurvey.attachments || [])];
                                                    atts[idx].url = e.target.value;
                                                    setEditingSurvey(prev => ({ ...prev, attachments: atts }));
                                                }}
                                                className="w-6" 
                                            />
                                            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => {
                                                const atts = [...(editingSurvey.attachments || [])];
                                                atts.splice(idx, 1);
                                                setEditingSurvey(prev => ({ ...prev, attachments: atts }));
                                            }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel header="Campi & Domande Sondaggio" leftIcon="pi pi-list mr-2">
                            <div className="mt-3">
                                <div className="flex justify-content-between align-items-center mb-4">
                                    <span className="text-secondary font-medium">Costruisci il modulo aggiungendo i campi desiderati.</span>
                                    <Button label="Aggiungi Domanda" icon="pi pi-plus" onClick={addField} />
                                </div>

                                {(editingSurvey.fields || []).map((field, index) => (
                                    <div key={field.id} className="field-builder-card">
                                        <div className="field-builder-header">
                                            <div className="flex align-items-center gap-2">
                                                <Tag value={`Domanda #${index + 1}`} severity="secondary" />
                                                <i className={FIELD_TYPE_OPTIONS.find(t => t.value === field.type)?.icon}></i>
                                                <span className="font-bold text-slate-700">{field.label || 'Senza titolo'}</span>
                                            </div>
                                            <div className="flex align-items-center gap-1">
                                                <Button icon="pi pi-arrow-up" rounded text severity="secondary" disabled={index === 0} onClick={() => moveField(index, 'up')} tooltip="Sposta Su" />
                                                <Button icon="pi pi-arrow-down" rounded text severity="secondary" disabled={index === (editingSurvey.fields?.length || 0) - 1} onClick={() => moveField(index, 'down')} tooltip="Sposta Giù" />
                                                <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => removeField(index)} tooltip="Rimuovi Campo" />
                                            </div>
                                        </div>

                                        <div className="grid p-fluid">
                                            <div className="col-12 md:col-6 mb-2">
                                                <label className="text-sm font-bold block mb-1">Etichetta Domanda *</label>
                                                <InputText value={field.label} onChange={(e) => updateField(index, { label: e.target.value })} placeholder="Inserisci il testo della domanda" />
                                            </div>

                                            <div className="col-12 md:col-4 mb-2">
                                                <label className="text-sm font-bold block mb-1">Tipo di Dato / Componente *</label>
                                                <Dropdown 
                                                    value={field.type} 
                                                    options={FIELD_TYPE_OPTIONS} 
                                                    onChange={(e) => updateField(index, { type: e.value })}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                />
                                            </div>

                                            <div className="col-12 md:col-2 mb-2 flex align-items-center pt-3">
                                                <div className="flex align-items-center gap-2">
                                                    <InputSwitch checked={field.required} onChange={(e) => updateField(index, { required: e.value || false })} />
                                                    <label className="text-sm font-bold">Obbligatorio</label>
                                                </div>
                                            </div>

                                            <div className="col-12 md:col-6 mb-2">
                                                <label className="text-sm font-bold block mb-1">Testo di Aiuto (opzionale)</label>
                                                <InputText value={field.helpText || ''} onChange={(e) => updateField(index, { helpText: e.target.value })} placeholder="Descrizione o istruzioni aggiuntive" />
                                            </div>

                                            <div className="col-12 md:col-6 mb-2">
                                                <label className="text-sm font-bold block mb-1">Placeholder (opzionale)</label>
                                                <InputText value={field.placeholder || ''} onChange={(e) => updateField(index, { placeholder: e.target.value })} placeholder="Testo segnaposto" />
                                            </div>

                                            {/* Options for select, multiselect, radio, checkbox */}
                                            {['select', 'multiselect', 'radio', 'checkbox'].includes(field.type) && (
                                                <div className="col-12 mb-2">
                                                    <label className="text-sm font-bold block mb-1">Opzioni Selezionabili (seperate da virgola o Invio)</label>
                                                    <InputText 
                                                        value={(field.options || []).map(o => o.label).join(', ')}
                                                        onChange={(e) => {
                                                            const rawOpts = e.target.value.split(',');
                                                            const options = rawOpts.map(opt => {
                                                                const trimmed = opt.trim();
                                                                return { label: trimmed, value: trimmed };
                                                            }).filter(o => o.label.length > 0);
                                                            updateField(index, { options });
                                                        }}
                                                        placeholder="Opzione 1, Opzione 2, Opzione 3"
                                                    />
                                                    <small className="text-secondary">Es: Si, No, Forse</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            )}

            {/* PANEL 3: DATA VISUALIZATION & ANALYTICS VIEW */}
            {viewMode === 'analytics' && analyticsSurvey && (
                <div className="survey-panel-card">
                    <div className="section-header-row">
                        <div>
                            <Button label="Torna ai Sondaggi" icon="pi pi-arrow-left" text severity="secondary" onClick={() => setViewMode('list')} className="mb-2" />
                            <h3 className="section-header-title">
                                <i className="pi pi-chart-bar text-primary"></i> Data Visualization: {analyticsSurvey.title}
                            </h3>
                        </div>
                        <a 
                            href={getExportCsvUrl(analyticsSurvey.id)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ textDecoration: 'none' }}
                        >
                            <Button label="Esporta Dati in CSV" icon="pi pi-download" severity="success" />
                        </a>
                    </div>

                    {/* Summary Metrics */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <i className="pi pi-inbox stat-icon"></i>
                            <div>
                                <div className="stat-val">{responses.length}</div>
                                <div className="stat-lbl">Totale Risposte Raccoglierte</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="pi pi-calendar stat-icon"></i>
                            <div>
                                <div className="stat-val">{responses.length > 0 ? new Date(responses[0].submittedAt).toLocaleDateString('it-IT') : '-'}</div>
                                <div className="stat-lbl">Ultima Risposta</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="pi pi-list-check stat-icon"></i>
                            <div>
                                <div className="stat-val">{analyticsSurvey.fields.length}</div>
                                <div className="stat-lbl">Campi Tracciati</div>
                            </div>
                        </div>
                    </div>

                    {/* Global Search Bar */}
                    <div className="mb-4 flex align-items-center justify-content-between gap-3">
                        <span className="p-input-icon-left w-full md:w-5">
                            <i className="pi pi-search" />
                            <InputText 
                                value={globalFilter} 
                                onChange={(e) => setGlobalFilter(e.target.value)} 
                                placeholder="Cerca in tutte le risposte..." 
                                className="w-full"
                            />
                        </span>
                        {globalFilter && (
                            <Button label="Cancella Filtro" icon="pi pi-filter-slash" text severity="secondary" onClick={() => setGlobalFilter('')} />
                        )}
                    </div>

                    {/* Searchable Data Table */}
                    {loadingResponses ? (
                        <div className="flex justify-content-center p-5">
                            <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                        </div>
                    ) : (
                        <DataTable 
                            value={filteredResponses} 
                            paginator 
                            rows={10}
                            emptyMessage="Nessuna risposta corrisponde alla ricerca."
                            className="p-datatable-sm shadow-1 border-round overflow-hidden"
                        >
                            <Column field="submittedAt" header="Data Invio" body={(r: SurveyResponse) => new Date(r.submittedAt).toLocaleString('it-IT')} sortable />
                            <Column field="userIdentifier" header="Utente" body={(r: SurveyResponse) => <Tag value={r.userIdentifier || 'Anonimo'} severity="info" />} sortable />
                            
                            {/* Dynamic Question Columns */}
                            {analyticsSurvey.fields.map(field => (
                                <Column 
                                    key={field.id} 
                                    header={field.label} 
                                    body={(r: SurveyResponse) => {
                                        const val = r.answers ? r.answers[field.id] : undefined;
                                        if (val === undefined || val === null || val === '') return <span className="text-400">-</span>;
                                        if (Array.isArray(val)) return val.join(', ');
                                        if (typeof val === 'boolean') return val ? 'Sì' : 'No';
                                        return String(val);
                                    }} 
                                />
                            ))}
                        </DataTable>
                    )}
                </div>
            )}
        </div>
    );
};
