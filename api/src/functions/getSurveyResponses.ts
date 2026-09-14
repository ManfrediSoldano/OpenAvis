import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function getSurveyResponses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const surveyId = request.query.get("surveyId");
    if (!surveyId) {
        return { status: 400, body: "Missing surveyId parameter" };
    }

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
        const dbService = new DatabaseService();
        const responses = await dbService.getSurveyResponses(surveyId, userDetails);
        return {
            status: 200,
            jsonBody: responses
        };
    } catch (error: any) {
        context.log("Error getting survey responses:", error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getSurveyResponses', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getSurveyResponses',
    handler: getSurveyResponses
});
