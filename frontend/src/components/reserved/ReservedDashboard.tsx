import React, { useState, useEffect } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
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

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/.auth/me');
                const data: UserInfo = await response.json();

                if (data.clientPrincipal && data.clientPrincipal.userRoles.includes('admin')) {
                    setUser({
                        details: data.clientPrincipal.userDetails,
                        roles: data.clientPrincipal.userRoles
                    });
                } else {
                    // Se non è admin, Azure SWA dovrebbe già aver bloccato la rotta, 
                    // ma per sicurezza reindirizziamo se arriviamo qui via client-side routing
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

    const items = [
        {
            label: 'Gestionale',
            items: [
                {
                    label: 'Candidati',
                    icon: 'pi pi-users',
                    className: activeSection === 'candidati' ? 'active-menu-item' : '',
                    command: () => setActiveSection('candidati')
                },
                {
                    label: 'Notizie',
                    icon: 'pi pi-megaphone',
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
            <header className="reserved-header">
                <div className="header-left">
                    <img src="/logo192.png" alt="Logo" className="reserved-logo" />
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
                    <div className="content-card shadow-1 border-round p-4">
                        {activeSection === 'candidati' && (
                            <section className="dashboard-section">
                                <h2 className="section-title"><i className="pi pi-users mr-2"></i>Gestione Candidati</h2>
                                <p className="section-description">Qui potrai visualizzare e gestire i nuovi aspiranti donatori che si sono iscritti tramite il sito.</p>
                                <div className="placeholder-content">
                                    <i className="pi pi-database text-400" style={{ fontSize: '3rem' }}></i>
                                    <p>I dati dei candidati verranno caricati qui.</p>
                                    <Button label="Aggiorna Lista" icon="pi pi-refresh" severity="secondary" outlined />
                                </div>
                            </section>
                        )}

                        {activeSection === 'notizie' && (
                            <section className="dashboard-section">
                                <h2 className="section-title"><i className="pi pi-megaphone mr-2"></i>Gestione Notizie</h2>
                                <p className="section-description">Area dedicata alla creazione e modifica delle notizie visualizzate nella homepage.</p>
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
