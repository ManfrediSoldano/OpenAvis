import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already accepted the cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e9ecef',
                padding: '1rem 2rem',
                boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.05)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                boxSizing: 'border-box'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '800px', flex: '1 1 auto' }}>
                <i className="pi pi-info-circle" style={{ fontSize: '1.75rem', color: '#3B82F6' }}></i>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5' }}>
                    Questo sito utilizza <strong>esclusivamente cookie tecnici</strong> necessari per il corretto funzionamento. <br />
                    Non vengono utilizzati cookie di profilazione o di terze parti per finalità commerciali.
                </p>
            </div>
            <div style={{ flexShrink: 0 }}>
                <Button
                    label="OK, ho capito"
                    icon="pi pi-check"
                    onClick={handleAccept}
                    className="p-button-primary p-button-rounded"
                />
            </div>
        </div>
    );
};

export default CookieBanner;
