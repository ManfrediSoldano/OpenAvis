import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import './ReservedDashboard.css';
import { Donor } from '../../../../shared/models/donor';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

interface UserInfo {
    clientPrincipal: {
        userId: string;
        userDetails: string;
        userRoles: string[];
    } | null;
}

const donorFields = [
    { name: 'firstName', label: 'Nome', type: 'text', required: true },
    { name: 'lastName', label: 'Cognome', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'gender', label: 'Sesso', type: 'select', options: [{ label: 'Maschio', value: 'male' }, { label: 'Femmina', value: 'female' }] },
    { name: 'birthDate', label: 'Data di Nascita', type: 'date' },
    { name: 'birthPlace', label: 'Luogo di Nascita', type: 'text' },
    { name: 'taxCode', label: 'Codice Fiscale', type: 'text' },
    { name: 'phone', label: 'Telefono', type: 'text' },
    { name: 'town', label: 'Comune', type: 'text' },
    { name: 'address', label: 'Indirizzo', type: 'text' },
    { name: 'education', label: 'Titolo di Studio', type: 'text' },
    { name: 'profession', label: 'Professione', type: 'text' },
    { name: 'donationPreferences', label: 'Preferenze Donazione', type: 'text' },
    { name: 'otherAssociations', label: 'Altre Associazioni', type: 'text' },
];

const ReservedDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'candidati' | 'notizie'>('candidati');
    const [user, setUser] = useState<{ details: string, roles: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loadingDonors, setLoadingDonors] = useState(false);
    const [donorDialog, setDonorDialog] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
    const [sendingConvocation, setSendingConvocation] = useState<string | null>(null);
    const toast = useRef<Toast>(null);

    const hasRole = (role: string) => user?.roles.includes('admin') || user?.roles.includes(role);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/.auth/me');
                const data: UserInfo = await response.json();

                if (data.clientPrincipal && (
                    data.clientPrincipal.userRoles.includes('admin') ||
                    data.clientPrincipal.userRoles.includes('news-editor') ||
                    data.clientPrincipal.userRoles.includes('candidates-manager')
                )) {
                    setUser({
                        details: data.clientPrincipal.userDetails,
                        roles: data.clientPrincipal.userRoles
                    });

                    // Set initial section based on roles
                    if (!data.clientPrincipal.userRoles.includes('admin') &&
                        !data.clientPrincipal.userRoles.includes('candidates-manager') &&
                        data.clientPrincipal.userRoles.includes('news-editor')) {
                        setActiveSection('notizie');
                    }

                } else {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Auth check failed', error);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const fetchDonors = async () => {
        setLoadingDonors(true);
        try {
            const res = await fetch('/api/getDonors');
            if (res.ok) {
                const data = await res.json();
                setDonors(data);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Errore Caricamento',
                    detail: `Impossibile recuperare i candidati (Status: ${res.status})`,
                    life: 5000
                });
            }
        } catch (error) {
            console.error("Failed to fetch donors", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Errore di Rete',
                detail: 'Controlla la tua connessione e riprova.',
                life: 5000
            });
        } finally {
            setLoadingDonors(false);
        }
    };

    useEffect(() => {
        if (user && activeSection === 'candidati' && hasRole('candidates-manager')) {
            fetchDonors();
        }
    }, [user, activeSection]);

    const saveDonor = async () => {
        try {
            const res = await fetch('/api/updateDonor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedDonor)
            });

            if (res.ok) {
                toast.current?.show({ severity: 'success', summary: 'Successo', detail: 'Candidato salvato' });
                setDonorDialog(false);
                fetchDonors();
            } else {
                const err = await res.text();
                toast.current?.show({ severity: 'error', summary: 'Errore', detail: err });
            }
        } catch (e) {
            toast.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete' });
        }
    };

    const sendConvocation = async (donor: any) => {
        if (!donor.convocationDate) {
            toast.current?.show({ severity: 'warn', summary: 'Attenzione', detail: 'Inserire prima la data della convocazione' });
            return;
        }

        setSendingConvocation(donor.email);
        try {
            const res = await fetch('/api/sendConvocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: donor.email, convocationDate: donor.convocationDate })
            });

            if (res.ok) {
                toast.current?.show({ severity: 'success', summary: 'Inviato', detail: 'Convocazione inviata con successo' });
                fetchDonors();
            } else {
                const err = await res.text();
                toast.current?.show({ severity: 'error', summary: 'Errore', detail: 'Invio fallito: ' + err });
            }
        } catch (e) {
            toast.current?.show({ severity: 'error', summary: 'Errore', detail: 'Errore di rete nell\'invio' });
        } finally {
            setSendingConvocation(null);
        }
    };

    const updateDonorField = (name: string, value: any) => {
        setSelectedDonor((prev: any) => ({ ...prev, [name]: value }));
    };

    const items = [
        {
            label: 'Gestionale',
            items: [
                {
                    label: 'Candidati',
                    icon: 'pi pi-users',
                    visible: hasRole('candidates-manager'),
                    className: activeSection === 'candidati' ? 'active-menu-item' : '',
                    command: () => setActiveSection('candidati')
                },
                {
                    label: 'Notizie',
                    icon: 'pi pi-megaphone',
                    visible: hasRole('news-editor'),
                    className: activeSection === 'notizie' ? 'active-menu-item' : '',
                    command: () => setActiveSection('notizie')
                }
            ]
        },
        {
            label: 'Account',
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => window.location.href = '/logout'
                }
            ]
        }
    ];

    const getStatusSeverity = (status?: string) => {
        switch (status) {
            case 'sent': return 'success';
            case 'error': return 'danger';
            case 'not_sent': return 'warning';
            default: return 'info';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'sent': return 'Inviata';
            case 'error': return 'Errore';
            case 'not_sent': return 'Non Inviata';
            default: return 'Nuovo';
        }
    };

    const convocationCell = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <Calendar
                    value={rowData.convocationDate ? new Date(rowData.convocationDate) : null}
                    onChange={(e) => {
                        const newDonors = donors.map((d: any) => d.email === rowData.email ? { ...d, convocationDate: e.value } : d);
                        setDonors(newDonors);
                        fetch('/api/updateDonor', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...rowData, convocationDate: e.value })
                        });
                    }}
                    showTime
                    hourFormat="24"
                    placeholder="Data e Ora"
                    className="p-inputtext-sm w-full"
                    appendTo={document.body}
                />
                <Button
                    label="Invio convocazione"
                    icon={sendingConvocation === rowData.email ? "pi pi-spin pi-spinner" : "pi pi-send"}
                    onClick={() => sendConvocation(rowData)}
                    disabled={sendingConvocation === rowData.email}
                    severity="danger"
                    size="small"
                />
            </div>
        );
    };

    const actionCell = (rowData: any) => {
        return (
            <Button icon="pi pi-pencil" rounded text severity="secondary" onClick={() => {
                const donor = { ...rowData };
                if (donor.birthDate) donor.birthDate = new Date(donor.birthDate);
                setSelectedDonor(donor);
                setDonorDialog(true);
            }} />
        );
    };

    const unsummonedDonors = donors.filter(d => !d.convocationStatus || d.convocationStatus === 'not_sent' || d.convocationStatus === 'error');
    const summonedDonors = donors.filter(d => d.convocationStatus === 'sent');

    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="reserved-dashboard-container">
            <Toast ref={toast} position="top-right" />
            <header className="reserved-header">
                <div className="header-left">
                    <img src="/images/Logo_AVIS.svg" alt="Logo" className="reserved-logo" />
                    <span className="area-title">Area Riservata OpenAvis</span>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span className="user-role">{user.details}</span>
                        <Avatar icon="pi pi-user" shape="circle" style={{ backgroundColor: '#e63946', color: '#ffffff' }} />
                    </div>
                </div>
            </header>

            <div className="reserved-layout">
                <aside className="reserved-sidebar">
                    <Menu model={items} className="w-full border-none shadow-none bg-transparent" />
                </aside>

                <main className="reserved-content">
                    <div className="content-card p-4">
                        {activeSection === 'candidati' && hasRole('candidates-manager') && (
                            <section className="dashboard-section">
                                <div className="flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h2 className="section-title m-0"><i className="pi pi-users mr-2"></i>Gestione Candidati</h2>
                                        <p className="text-secondary mt-1">Gestisci gli aspiranti donatori e le convocazioni.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button label="Nuovo Candidato" icon="pi pi-plus" severity="danger" onClick={() => {
                                            setSelectedDonor({ firstName: '', lastName: '', email: '', createdAt: new Date().toISOString() });
                                            setDonorDialog(true);
                                        }} />
                                        <Button icon="pi pi-refresh" rounded text onClick={fetchDonors} loading={loadingDonors} />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h3 className="text-xl font-bold mb-3">Aspiranti non ancora convocati</h3>
                                    <DataTable value={unsummonedDonors} loading={loadingDonors} paginator rows={5}
                                        className="p-datatable-sm shadow-1 border-round overflow-hidden"
                                        emptyMessage="Nessun candidato da convocare.">
                                        <Column field="lastName" header="Cognome" body={(r) => <b>{r.lastName}</b>} sortable />
                                        <Column field="firstName" header="Nome" sortable />
                                        <Column field="email" header="Email" />
                                        <Column field="convocationStatus" header="Stato" body={(r) => <Tag severity={getStatusSeverity(r.convocationStatus)} value={getStatusLabel(r.convocationStatus)} />} />
                                        <Column header="Convocazione" body={convocationCell} style={{ minWidth: '350px' }} />
                                        <Column body={actionCell} style={{ width: '50px' }} />
                                    </DataTable>
                                </div>

                                <Divider />

                                <div className="mt-5">
                                    <h3 className="text-xl font-bold mb-3">Aspiranti già convocati</h3>
                                    <DataTable value={summonedDonors} loading={loadingDonors} paginator rows={5}
                                        className="p-datatable-sm shadow-1 border-round overflow-hidden"
                                        emptyMessage="Nessun candidato già convocato.">
                                        <Column field="lastName" header="Cognome" body={(r) => <b>{r.lastName}</b>} sortable />
                                        <Column field="firstName" header="Nome" sortable />
                                        <Column field="email" header="Email" />
                                        <Column field="convocationDate" header="Data Convocazione"
                                            body={(rowData) => rowData.convocationDate ? new Date(rowData.convocationDate).toLocaleString('it-IT') : '-'} />
                                        <Column field="convocationStatus" header="Stato" body={(r) => <Tag severity="success" value="Inviata" />} />
                                        <Column body={actionCell} style={{ width: '50px' }} />
                                    </DataTable>
                                </div>
                            </section>
                        )}

                        {activeSection === 'notizie' && hasRole('news-editor') && (
                            <section className="dashboard-section">
                                <h2 className="section-title"><i className="pi pi-megaphone mr-2"></i>Gestione Notizie</h2>
                                <p className="section-description text-secondary">Area dedicata alla creazione e modifica delle notizie visualizzate nella homepage.</p>
                                <div className="placeholder-content">
                                    <i className="pi pi-file-edit text-400" style={{ fontSize: '3rem' }}></i>
                                    <p>L'interfaccia di editing notizie sarà disponibile a breve.</p>
                                    <Button label="Nuova Notizia" icon="pi pi-plus" severity="danger" />
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>

            <Dialog header="Dettagli Candidato" visible={donorDialog} style={{ width: '50vw' }} onHide={() => setDonorDialog(false)}
                footer={<Button label="Salva" icon="pi pi-check" onClick={saveDonor} severity="danger" />}>
                <div className="grid p-fluid">
                    {donorFields.map(field => (
                        <div key={field.name} className="field col-12 md:col-6 mb-3">
                            <label className="block mb-2 font-bold">{field.label}</label>
                            {field.type === 'text' || field.type === 'email' ? (
                                <InputText value={selectedDonor?.[field.name] || ''} onChange={(e) => updateDonorField(field.name, e.target.value)} />
                            ) : field.type === 'select' ? (
                                <Dropdown value={selectedDonor?.[field.name]} options={field.options} onChange={(e) => updateDonorField(field.name, e.value)} placeholder="Seleziona" />
                            ) : field.type === 'date' ? (
                                <Calendar value={selectedDonor?.[field.name] ? new Date(selectedDonor[field.name]) : null} onChange={(e) => updateDonorField(field.name, e.value)} dateFormat="dd/mm/yy" showIcon />
                            ) : null}
                        </div>
                    ))}
                </div>
            </Dialog>
        </div>
    );
};

export default ReservedDashboard;
