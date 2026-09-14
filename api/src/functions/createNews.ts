import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { serverLogAction } from "../utils/authUtils";

export async function createNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Creating news...`);

    // Security check
    const principalHeader = request.headers.get("x-ms-client-principal");
    if (!principalHeader) {
        return { status: 401, body: "Unauthorized" };
    }
    const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
    const roles = principal.userRoles || [];
    // Verify roles. Adjust according to the roles setup (e.g. admin or news-manager)
    if (!roles.includes("admin") && !roles.includes("news-editor")) {
        return { status: 403, body: "Forbidden" };
    }

    try {
        const newsData = await request.json() as any;
        if (!newsData.title || !newsData.contentMarkdown) {
            return { status: 400, body: "Title and content are required" };
        }

        const dbService = new DatabaseService();
        
        // Add ID and createdAt if not present
        if (!newsData.id) {
            newsData.id = crypto.randomUUID();
        }
        if (!newsData.createdAt) {
            newsData.createdAt = new Date().toISOString();
        }
        
        if (!newsData.date) {
            newsData.date = new Date().toISOString(); // Default date to now
        }

        const createdItem = await dbService.createNews(newsData);

        // Server-side logging
        await serverLogAction(request, 'news_create', newsData.id, { title: newsData.title });

        return {
            status: 201,
            jsonBody: createdItem
        };
    } catch (error: any) {
        context.error("Error creating news:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('createNews', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'createNews',
    handler: createNews
});
