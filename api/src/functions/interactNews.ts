import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function interactNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed interactNews request for url "${request.url}"`);

    const id = request.query.get('id');
    const action = request.query.get('action'); // 'view' or 'like'

    if (!id || !action) {
        return {
            status: 400,
            body: "Please pass an id and an action on the query string"
        };
    }

    const dbService = new DatabaseService();
    try {
        let result;
        if (action === 'view') {
            result = await dbService.incrementNewsView(id);
        } else if (action === 'like') {
            result = await dbService.incrementNewsLike(id);
        } else {
            return {
                status: 400,
                body: "Invalid action. Use 'view' or 'like'."
            };
        }

        if (!result) {
            return {
                status: 404,
                body: "News item not found"
            };
        }

        return {
            status: 200,
            jsonBody: result
        };
    } catch (error) {
        context.log("Error interacting with news:", error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('interactNews', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'interactNews',
    handler: interactNews
});
