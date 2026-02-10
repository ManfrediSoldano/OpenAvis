import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function retrieveNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.query.get('id');

    if (!id) {
        return {
            status: 400,
            body: "Please pass an id on the query string"
        };
    }

    const dbService = new DatabaseService();
    try {
        const newsItem = await dbService.getNews(id);

        if (!newsItem) {
            return {
                status: 404,
                body: "News item not found"
            };
        }

        return {
            status: 200,
            jsonBody: newsItem
        };
    } catch (error) {
        context.log("Error retrieving news:", error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('retrieveNews', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'retrieveNews',
    handler: retrieveNews
});
