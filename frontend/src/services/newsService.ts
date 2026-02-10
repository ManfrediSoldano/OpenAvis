import { ReactNode } from "react";

export interface NewsHighlight {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
}

export interface NewsDetail {
    id: string;
    title: string;
    contentMarkdown: string;
    imageUrl: string;
    author: {
        name: string;
        avatarUrl: string;
    };
    attachments: {
        name: string;
        url: string;
    }[];
    date: string;
}

// Mock data
const MOCK_HIGHLIGHTS: NewsHighlight[] = [
    {
        id: "1",
        imageUrl: "https://picsum.photos/800/400?random=1",
        title: "Giornata Mondiale del Donatore",
        subtitle: "Unisciti a noi per celebrare i donatori di tutto il mondo.",
    },
    {
        id: "2",
        imageUrl: "https://picsum.photos/800/400?random=2",
        title: "Nuovi orari centro prelievi",
        subtitle: "A partire dal prossimo mese cambieranno gli orari di apertura.",
    },
    {
        id: "3",
        imageUrl: "https://picsum.photos/800/400?random=3",
        title: "Raccolta straordinaria",
        subtitle: "Domenica prossima apertura straordinaria per le donazioni.",
    },
];

const MOCK_NEWS_DETAIL: NewsDetail = {
    id: "1",
    title: "Giornata Mondiale del Donatore",
    imageUrl: "https://picsum.photos/1200/600?random=1",
    contentMarkdown: `
# Celebriamo la generosità
Ogni anno, il 14 giugno, i paesi di tutto il mondo celebrano la **Giornata Mondiale del Donatore di Sangue**. L'evento serve a ringraziare i donatori volontari e non retribuiti per il loro dono salvavita di sangue e ad aumentare la consapevolezza della necessità di _donazioni regolari_ di sangue per garantire che tutti gli individui e le comunità abbiano accesso a prodotti sanguigni sicuri e di qualità garantita.

## Perché è importante?
Il sangue sicuro e i prodotti sanguigni e la loro trasfusione sono un aspetto critico della cura e della salute pubblica. Salvano milioni di vite e migliorano la salute e la qualità della vita di molti pazienti ogni giorno.

*   Pazienti che soffrono di condizioni potenzialmente letali
*   Procedure mediche e chirurgiche complesse
*   Assistenza materna e infantile
*   Risposta alle emergenze

> "Donare sangue è un atto di solidarietà. Unisciti allo sforzo e salva delle vite."

### Come partecipare
Puoi prenotare la tua donazione attraverso il nostro portale o contattando la sede AVIS più vicina.
    `,
    author: {
        name: "Mario Rossi",
        avatarUrl: "https://ui-avatars.com/api/?name=Mario+Rossi&background=random"
    },
    attachments: [
        { name: "Locandina Evento.pdf", url: "#" },
        { name: "Modulo Iscrizione.pdf", url: "#" }
    ],
    date: "14 Giugno 2024"
};


export const getHighlights = async (): Promise<NewsHighlight[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_HIGHLIGHTS), 500);
    });
};

export const retrieveNews = async (id: string): Promise<NewsDetail> => {
    // Simulate API delay and dynamic content based on ID (mocked with same content for now)
    return new Promise((resolve) => {
        setTimeout(() => {
            const detail = { ...MOCK_NEWS_DETAIL, id };

            // Mock scenario: ID "2" has no attachments
            if (id === "2") {
                detail.attachments = [];
            }

            detail.title = MOCK_HIGHLIGHTS.find(h => h.id === id)?.title || MOCK_NEWS_DETAIL.title;
            resolve(detail);
        }, 500);
    });
};
