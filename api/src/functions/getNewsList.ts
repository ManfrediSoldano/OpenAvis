import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function getNewsList(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const dbService = new DatabaseService();
    try {
        const newsList = await dbService.getAllNews();

        return {
            status: 200,
            jsonBody: newsList.map(h => ({
                id: h.id,
                imageUrl: h.imageUrl,
                title: h.title,
                subtitle: h.subtitle
            }))
        };
    } catch (error) {
        context.log("Error getting news list:", error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('getNewsList', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getNewsList',
    handler: getNewsList
});
