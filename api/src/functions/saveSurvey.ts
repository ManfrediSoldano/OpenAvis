import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function saveSurvey(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Saving survey...`);

    const principalHeader = request.headers.get("x-ms-client-principal");
    let userDetails = "system/admin";
    if (principalHeader) {
        try {
            const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
            const roles = principal.userRoles || [];
            userDetails = principal.userDetails || principal.userId || userDetails;
            if (!roles.includes("admin") && !roles.includes("news-editor") && !roles.includes("survey-manager")) {
                return { status: 403, body: "Forbidden - Insufficient permissions" };
            }
        } catch (e) {
            context.log("Failed to parse principal header");
        }
    }

    try {
        const body: any = await request.json();
        if (!body || !body.title) {
            return { status: 400, body: "Title is required" };
        }
        if (body.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.id)) {
            return { status: 400, body: "Survey ID must contain only lowercase letters, numbers and single hyphens" };
        }

        const dbService = new DatabaseService();
        const savedSurvey = await dbService.saveSurvey(body, userDetails);
        return {
            status: 200,
            jsonBody: savedSurvey
        };
    } catch (error: any) {
        context.log("Error saving survey:", error);
        return {
            status: 500,
            body: `Internal Server Error: ${error.message || error}`
        };
    }
}

app.http('saveSurvey', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'saveSurvey',
    handler: saveSurvey
});
