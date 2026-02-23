import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import './ReservedDashboard.css';

interface UserInfo {
    clientPrincipal: {
        userId: string;
        userDetails: string;
        userRoles: string[];
    } | null;
}

const ReservedDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'candidati' | 'notizie'>('candidati');
    const [user, setUser] = useState<{ details: string, roles: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [donors, setDonors] = useState<any[]>([]);
    const [loadingDonors, setLoadingDonors] = useState(false);
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
                                        <p className="text-secondary mt-1">Lista degli aspiranti donatori iscritti sul sito.</p>
                                    </div>
                                    <Button icon="pi pi-refresh" rounded text onClick={fetchDonors} loading={loadingDonors} />
                                </div>

                                <DataTable value={donors} loading={loadingDonors} paginator rows={10}
                                    className="p-datatable-sm shadow-1 border-round overflow-hidden"
                                    emptyMessage="Nessun candidato trovato.">
                                    <Column field="firstName" header="Nome" sortable />
                                    <Column field="lastName" header="Cognome" sortable />
                                    <Column field="email" header="Email" sortable />
                                    <Column field="phone" header="Telefono" />
                                    <Column field="donationType" header="Tipo" sortable />
                                    <Column field="createdAt" header="Data Iscrizione"
                                        body={(rowData) => rowData.createdAt ? new Date(rowData.createdAt).toLocaleDateString('it-IT') : '-'} sortable />
                                </DataTable>
                            </section>
                        )}

                        {activeSection === 'notizie' && hasRole('news-editor') && (
                            <section className="dashboard-section">
                                <h2 className="section-title"><i className="pi pi- megaphone mr-2"></i>Gestione Notizie</h2>
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
        </div>
    );
};

export default ReservedDashboard;
