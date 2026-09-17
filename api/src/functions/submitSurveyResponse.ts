import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function submitSurveyResponse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const body: any = await request.json();
        const { surveyId, userIdentifier, answers, privacyPolicyAccepted } = body || {};

        if (!surveyId || !answers) {
            return { status: 400, body: "Survey ID and answers are required" };
        }

        if (privacyPolicyAccepted !== true) {
            return { status: 400, body: "È necessario accettare l'informativa sulla privacy." };
        }

        const dbService = new DatabaseService();
        const survey = await dbService.getSurveyById(surveyId);
        if (!survey) {
            return { status: 404, body: "Survey not found" };
        }

        if (!survey.isActive) {
            return { status: 400, body: "This survey is currently closed" };
        }

        // Single-submission check if required
        if (!survey.allowMultipleSubmissions && userIdentifier) {
            const hasSubmitted = await dbService.hasUserSubmittedSurvey(surveyId, userIdentifier);
            if (hasSubmitted) {
                return { status: 409, body: "Hai già risposto a questo sondaggio." };
            }
        }

        // Validate required fields
        for (const field of survey.fields) {
            if (field.required) {
                const answer = answers[field.id];
                if (answer === undefined || answer === null || answer === "" || (Array.isArray(answer) && answer.length === 0)) {
                    return { status: 400, body: `Campo obbligatorio non compilato: "${field.label}"` };
                }
            }
        }

        const responseDoc = await dbService.saveSurveyResponse({
            surveyId,
            userIdentifier: userIdentifier || "anonymous",
            answers,
            privacyPolicyAccepted: true,
            privacyPolicyAcceptedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString()
        });

        return {
            status: 200,
            jsonBody: { success: true, responseId: responseDoc?.id }
        };
    } catch (error: any) {
        context.log("Error submitting survey response:", error);
        return {
            status: 500,
            body: `Internal Server Error: ${error.message || error}`
        };
    }
}

app.http('submitSurveyResponse', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'submitSurveyResponse',
    handler: submitSurveyResponse
});
