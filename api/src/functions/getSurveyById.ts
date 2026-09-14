import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function getSurveyById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const surveyId = request.query.get("id");
    if (!surveyId) {
        return { status: 400, body: "Missing survey id parameter" };
    }

    try {
        const dbService = new DatabaseService();
        const survey = await dbService.getSurveyById(surveyId);
        if (!survey) {
            return { status: 404, body: "Survey not found" };
        }

        return {
            status: 200,
            jsonBody: survey
        };
    } catch (error) {
        context.log(`Error fetching survey ${surveyId}:`, error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('getSurveyById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getSurveyById',
    handler: getSurveyById
});
