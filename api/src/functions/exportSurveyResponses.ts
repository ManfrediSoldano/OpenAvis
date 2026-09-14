import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

function escapeCsvCell(cellValue: any): string {
    if (cellValue === undefined || cellValue === null) return '""';
    let valStr = typeof cellValue === 'object' ? JSON.stringify(cellValue) : String(cellValue);
    // Double quote internal quotes
    valStr = valStr.replace(/"/g, '""');
    return `"${valStr}"`;
}

export async function exportSurveyResponses(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const survey = await dbService.getSurveyById(surveyId);
        if (!survey) {
            return { status: 404, body: "Survey not found" };
        }

        const responses = await dbService.getSurveyResponses(surveyId, userDetails);
        await dbService.saveAuditLog(userDetails, 'EXPORT_SURVEY_DATA', surveyId, { count: responses.length });

        // Build CSV headers
        const headers = ["ID Risposta", "Data Invio", "Identificativo Utente", ...survey.fields.map(f => f.label)];
        const csvLines: string[] = [headers.map(escapeCsvCell).join(",")];

        // Build CSV data rows
        for (const resp of responses) {
            const row: string[] = [
                escapeCsvCell(resp.id),
                escapeCsvCell(resp.submittedAt),
                escapeCsvCell(resp.userIdentifier || "N/D")
            ];

            for (const field of survey.fields) {
                const rawVal = resp.answers ? resp.answers[field.id] : "";
                row.push(escapeCsvCell(rawVal));
            }

            csvLines.push(row.join(","));
        }

        const csvContent = csvLines.join("\n");
        const cleanTitle = (survey.title || "export").replace(/[^a-zA-Z0-9_-]/g, "_");

        return {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="sondaggio_${cleanTitle}_${Date.now()}.csv"`
            },
            body: csvContent
        };
    } catch (error: any) {
        context.log("Error exporting survey responses:", error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('exportSurveyResponses', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'exportSurveyResponses',
    handler: exportSurveyResponses
});
