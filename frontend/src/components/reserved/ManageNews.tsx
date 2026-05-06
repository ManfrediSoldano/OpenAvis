import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { retrieveNews, NewsHighlight, NewsDetail } from '../../services/newsService';
import './ManageNews.css';

interface ManageNewsProps {
    toastRef: React.RefObject<Toast>;
}

const ManageNews: React.FC<ManageNewsProps> = ({ toastRef }) => {
    const [newsList, setNewsList] = useState<NewsHighlight[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState<any[] | null>(null);
    const [editingNews, setEditingNews] = useState<{ [key: string]: NewsDetail }>({});
    
    // For new news dialog
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [newNews, setNewNews] = useState<Partial<NewsDetail>>({ title: '', contentMarkdown: '', author: { name: 'Admin', avatarUrl: '' }, isHighlight: false });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/getNewsList');
            if (res.ok) {
                const data = await res.json();
                setNewsList(data);
            }
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore nel caricamento notizie' });
        } finally {
            setLoading(false);
        }
    };

    const loadNewsDetail = async (id: string) => {
        if (!editingNews[id]) {
            const detail = await retrieveNews(id);
            if (detail) {
                setEditingNews(prev => ({ ...prev, [id]: detail }));
            }
        }
    };

    const onRowExpand = async (e: any) => {
        const news = e.data as NewsHighlight;
        await loadNewsDetail(news.id);
    };

    const handleSaveNew = async () => {
        if (!newNews.title || !newNews.contentMarkdown) {
            toastRef.current?.show({ severity: 'warn', summary: 'Attenzione', detail: 'Titolo e contenuto sono obbligatori' });
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/createNews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNews)
            });
            if (res.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Successo', detail: 'Notizia creata' });
                setShowNewDialog(false);
                setNewNews({ title: '', contentMarkdown: '', author: { name: 'Admin', avatarUrl: '' }, isHighlight: false });
                fetchNews();
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Creazione fallita' });
            }
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id: string) => {
        const detail = editingNews[id];
        try {
            const res = await fetch('/api/updateNews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(detail)
            });
            if (res.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Successo', detail: 'Notizia aggiornata' });
                fetchNews();
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Aggiornamento fallito' });
            }
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa notizia?")) return;
        try {
            const res = await fetch(`/api/deleteNews?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Successo', detail: 'Notizia eliminata' });
                fetchNews();
            }
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete' });
        }
    };

    const handleToggleHighlight = async (newsId: string, newStatus: boolean) => {
        // Optimistic UI update
        setNewsList(prev => prev.map(n => n.id === newsId ? { ...n, isHighlight: newStatus } : n));
        if (editingNews[newsId]) {
            setEditingNews(prev => ({ ...prev, [newsId]: { ...prev[newsId], isHighlight: newStatus } }));
        }

        try {
            // we need full detail to update, or just load it if missing
            let detail = editingNews[newsId];
            if (!detail) {
                detail = await retrieveNews(newsId) as NewsDetail;
            }
            if (!detail) return;

            const updatedDetail = { ...detail, isHighlight: newStatus };
            
            const res = await fetch('/api/updateNews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDetail)
            });

            if (res.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Successo', detail: 'Stato evidenza aggiornato', life: 3000 });
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Aggiornamento fallito' });
                fetchNews(); // revert
            }
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete' });
            fetchNews(); // revert
        }
    };

    const myUploader = async (event: any, isNew: boolean, newsId?: string) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/uploadFile', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const url = data.url;
                const isImage = file.type.startsWith('image/');
                
                toastRef.current?.show({ severity: 'success', summary: 'Successo', detail: 'File caricato' });
                
                if (isNew) {
                    if (isImage) {
                        setNewNews(prev => ({ 
                            ...prev, 
                            contentMarkdown: prev.contentMarkdown + `\n\n![${file.name}](${url})` 
                        }));
                    } else {
                        setNewNews(prev => ({
                            ...prev,
                            attachments: [...(prev.attachments || []), { name: file.name, url }]
                        }));
                    }
                } else if (newsId) {
                    if (isImage) {
                        setEditingNews(prev => ({
                            ...prev,
                            [newsId]: {
                                ...prev[newsId],
                                contentMarkdown: prev[newsId].contentMarkdown + `\n\n![${file.name}](${url})`
                            }
                        }));
                    } else {
                        setEditingNews(prev => ({
                            ...prev,
                            [newsId]: {
                                ...prev[newsId],
                                attachments: [...(prev[newsId].attachments || []), { name: file.name, url }]
                            }
                        }));
                    }
                }
                event.options.clear();
            } else {
                toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Caricamento fallito' });
            }
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete' });
        }
    };

    const rowExpansionTemplate = (data: NewsHighlight) => {
        const detail = editingNews[data.id];
        if (!detail) return <div className="p-3">Caricamento dettagli...</div>;

        return (
            <div className="p-3 surface-ground border-round">
                <div className="grid">
                    <div className="col-12 mb-3 flex justify-content-between align-items-center">
                        <div className="flex-1 flex align-items-center gap-3">
                            <InputText 
                                value={detail.title} 
                                onChange={(e) => setEditingNews(prev => ({ ...prev, [data.id]: { ...detail, title: e.target.value } }))}
                                className="w-8 font-bold text-xl" 
                            />
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId={`highlight-${data.id}`} 
                                    checked={detail.isHighlight || false} 
                                    onChange={(e) => setEditingNews(prev => ({ ...prev, [data.id]: { ...detail, isHighlight: e.checked ?? false } }))} 
                                />
                                <label htmlFor={`highlight-${data.id}`} className="ml-2 font-bold cursor-pointer">In Evidenza (Highlight)</label>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button icon="pi pi-save" label="Salva" severity="success" onClick={() => handleUpdate(data.id)} />
                            <Button icon="pi pi-trash" label="Elimina" severity="danger" onClick={() => handleDelete(data.id)} />
                        </div>
                    </div>
                    
                    <div className="col-12 mb-3">
                        <div className="flex align-items-center gap-3 mb-2">
                            <span className="font-bold">Carica File/Immagine:</span>
                            <FileUpload 
                                mode="basic" 
                                auto 
                                customUpload 
                                uploadHandler={(e) => myUploader(e, false, data.id)} 
                                chooseLabel="Seleziona File" 
                            />
                        </div>
                        <small className="text-secondary">Le immagini verranno aggiunte al testo, i file agli allegati.</small>
                    </div>

                    <div className="col-12" data-color-mode="light">
                        <MDEditor
                            value={detail.contentMarkdown}
                            onChange={(val) => setEditingNews(prev => ({ ...prev, [data.id]: { ...detail, contentMarkdown: val || '' } }))}
                            height={400}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="manage-news-container">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="m-0"><i className="pi pi-megaphone mr-2"></i>Gestione Notizie</h2>
                    <p className="text-secondary mt-1">Crea, modifica e pubblica notizie.</p>
                </div>
                <Button label="Nuova Notizia" icon="pi pi-plus" severity="danger" onClick={() => setShowNewDialog(true)} />
            </div>

            <DataTable 
                value={newsList} 
                expandedRows={expandedRows} 
                onRowToggle={(e) => setExpandedRows(e.data)}
                onRowExpand={onRowExpand}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                className="shadow-1 border-round"
                loading={loading}
                emptyMessage="Nessuna notizia trovata."
            >
                <Column expander style={{ width: '5rem' }} />
                <Column field="title" header="Titolo" sortable />
                <Column field="subtitle" header="Sottotitolo" />
                <Column 
                    field="isHighlight" 
                    header="In Evidenza" 
                    body={(rowData) => (
                        <div className="flex align-items-center justify-content-center" onClick={(e) => e.stopPropagation()}>
                            <InputSwitch 
                                checked={rowData.isHighlight || false} 
                                onChange={(e) => handleToggleHighlight(rowData.id, e.value || false)} 
                            />
                        </div>
                    )} 
                    style={{ width: '8rem', textAlign: 'center' }} 
                />
            </DataTable>

            <Dialog header="Nuova Notizia" visible={showNewDialog} style={{ width: '80vw' }} onHide={() => setShowNewDialog(false)} maximized>
                <div className="grid p-fluid">
                    <div className="col-12 mb-3">
                        <label className="font-bold">Titolo</label>
                        <InputText value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} />
                    </div>
                    <div className="col-12 md:col-6 mb-3">
                        <label className="font-bold">Autore (Nome)</label>
                        <InputText value={newNews.author?.name} onChange={(e) => setNewNews({ ...newNews, author: { name: e.target.value, avatarUrl: newNews.author?.avatarUrl || '' } })} />
                    </div>
                    <div className="col-12 md:col-6 mb-3 flex align-items-end pb-2">
                        <div className="flex align-items-center">
                            <Checkbox 
                                inputId="new-highlight" 
                                checked={newNews.isHighlight || false} 
                                onChange={(e) => setNewNews({ ...newNews, isHighlight: e.checked ?? false })} 
                            />
                            <label htmlFor="new-highlight" className="ml-2 font-bold cursor-pointer">Segna come Notizia in Evidenza (Highlight)</label>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="flex align-items-center gap-3 mb-2">
                            <span className="font-bold">Carica File/Immagine:</span>
                            <FileUpload 
                                mode="basic" 
                                auto 
                                customUpload 
                                uploadHandler={(e) => myUploader(e, true)} 
                                chooseLabel="Seleziona File" 
                            />
                        </div>
                        <small className="text-secondary">Le immagini verranno inserite automaticamente nel testo.</small>
                    </div>
                    <div className="col-12" data-color-mode="light">
                        <label className="font-bold mb-2 block">Contenuto (Markdown)</label>
                        <MDEditor
                            value={newNews.contentMarkdown}
                            onChange={(val) => setNewNews({ ...newNews, contentMarkdown: val || '' })}
                            height={400}
                        />
                    </div>
                    <div className="col-12 flex justify-content-end mt-4">
                        <Button label="Annulla" icon="pi pi-times" severity="secondary" text onClick={() => setShowNewDialog(false)} className="mr-2" />
                        <Button label="Salva Notizia" icon="pi pi-check" severity="danger" onClick={handleSaveNew} loading={saving} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ManageNews;
