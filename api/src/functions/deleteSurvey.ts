import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function deleteSurvey(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const surveyId = body?.id || request.query.get("id");
        if (!surveyId) {
            return { status: 400, body: "Missing survey id" };
        }

        const dbService = new DatabaseService();
        const success = await dbService.deleteSurvey(surveyId, userDetails);
        if (success) {
            return { status: 200, jsonBody: { success: true, id: surveyId } };
        } else {
            return { status: 400, body: "Failed to delete survey" };
        }
    } catch (error: any) {
        context.log("Error deleting survey:", error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('deleteSurvey', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'deleteSurvey',
    handler: deleteSurvey
});
