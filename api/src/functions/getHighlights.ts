import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function getHighlights(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const dbService = new DatabaseService();
    try {
        const highlights = await dbService.getHighlights();

        return {
            status: 200,
            jsonBody: highlights.map(h => ({
                id: h.id,
                imageUrl: h.imageUrl,
                title: h.title,
                subtitle: h.highlightType === 'survey'
                    ? 'Partecipa al sondaggio'
                    : h.subtitle,
                contentType: h.highlightType
            }))
        };
    } catch (error) {
        context.log("Error getting highlights:", error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('getHighlights', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getHighlights',
    handler: getHighlights
});
