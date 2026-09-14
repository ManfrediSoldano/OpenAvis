import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { serverLogAction } from "../utils/authUtils";

export async function updateNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Updating news...`);

    // Security check
    const principalHeader = request.headers.get("x-ms-client-principal");
    if (!principalHeader) {
        return { status: 401, body: "Unauthorized" };
    }
    const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
    const roles = principal.userRoles || [];
    if (!roles.includes("admin") && !roles.includes("news-editor")) {
        return { status: 403, body: "Forbidden" };
    }

    try {
        const newsData = await request.json() as any;
        if (!newsData.id) {
            return { status: 400, body: "News ID is required" };
        }

        const dbService = new DatabaseService();
        
        // Fetch existing news to ensure we are updating
        const existingNews = await dbService.getNews(newsData.id);
        if (!existingNews) {
            return { status: 404, body: "News not found" };
        }

        // Merge fields or directly update
        const updatedNewsData = { ...existingNews, ...newsData };
        updatedNewsData.updatedAt = new Date().toISOString();

        const updatedItem = await dbService.updateNews(updatedNewsData);

        // Server-side logging
        await serverLogAction(request, 'news_update', updatedItem.id, { title: updatedItem.title });

        return {
            status: 200,
            jsonBody: updatedItem
        };
    } catch (error: any) {
        context.error("Error updating news:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('updateNews', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'updateNews',
    handler: updateNews
});
