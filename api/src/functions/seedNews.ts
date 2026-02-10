import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function seedNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Seeding news data...`);

    const dbService = new DatabaseService();

    const mockNewsToSeed = [
        {
            id: "1",
            title: "Giornata Mondiale del Donatore",
            subtitle: "Unisciti a noi per celebrare i donatori di tutto il mondo.",
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
            date: "14 Giugno 2024",
            isHighlight: true,
            createdAt: new Date().toISOString()
        },
        {
            id: "2",
            title: "Nuovi orari centro prelievi",
            subtitle: "A partire dal prossimo mese cambieranno gli orari di apertura.",
            imageUrl: "https://picsum.photos/800/400?random=2",
            contentMarkdown: `
# Aggiornamento Orari

Si comunica che a partire dal 1° Luglio....
            `,
            author: { name: "Segreteria", avatarUrl: "" },
            attachments: [],
            date: "10 Luglio 2024",
            isHighlight: true,
            createdAt: new Date().toISOString()
        },
        {
            id: "3",
            title: "Raccolta straordinaria",
            subtitle: "Domenica prossima apertura straordinaria per le donazioni.",
            imageUrl: "https://picsum.photos/800/400?random=3",
            contentMarkdown: `
# Raccolta Straordinaria

Vi aspettiamo numerosi....
            `,
            author: { name: "Presidente", avatarUrl: "" },
            attachments: [],
            date: "20 Luglio 2024",
            isHighlight: true,
            createdAt: new Date().toISOString()
        }
    ];

    try {
        const results = [];
        for (const item of mockNewsToSeed) {
            const res = await dbService.createNews(item);
            results.push(res);
        }

        return {
            status: 200,
            jsonBody: { message: "Seeding complete", results }
        };
    } catch (error) {
        context.log("Error seeding news:", error);
        return {
            status: 500,
            body: "Internal Server Error during seeding"
        };
    }
}

app.http('seedNews', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    handler: seedNews
});
