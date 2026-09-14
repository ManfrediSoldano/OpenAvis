import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function getSurveys(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Fetching all surveys (Reserved area)...`);

    const principalHeader = request.headers.get("x-ms-client-principal");
    let userDetails = "system/local";
    if (principalHeader) {
        try {
            const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
            const roles = principal.userRoles || [];
            userDetails = principal.userDetails || principal.userId || userDetails;
            if (!roles.includes("admin") && !roles.includes("news-editor") && !roles.includes("survey-manager")) {
                return { status: 403, body: "Forbidden - Insufficient permissions" };
            }
        } catch (e) {
            context.log("Failed to parse client principal header");
        }
    }

    try {
        const dbService = new DatabaseService();
        const surveys = await dbService.getAllSurveys();
        return {
            status: 200,
            jsonBody: surveys
        };
    } catch (error) {
        context.log("Error fetching surveys:", error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('getSurveys', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getSurveys',
    handler: getSurveys
});
