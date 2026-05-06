import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { serverLogAction } from "../utils/authUtils";

export async function deleteNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Deleting news...`);

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
        const id = request.query.get("id");
        if (!id) {
            return { status: 400, body: "News ID is required" };
        }

        const dbService = new DatabaseService();
        
        const existingNews = await dbService.getNews(id);
        if (!existingNews) {
            return { status: 404, body: "News not found" };
        }

        await dbService.deleteNews(id);

        // Server-side logging
        await serverLogAction(request, 'news_delete', id, { title: existingNews.title });

        return {
            status: 200,
            jsonBody: { message: "News deleted successfully" }
        };
    } catch (error: any) {
        context.error("Error deleting news:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('deleteNews', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'deleteNews',
    handler: deleteNews
});
