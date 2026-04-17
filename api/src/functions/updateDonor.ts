import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { serverLogAction } from "../utils/authUtils";

export async function updateDonor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Updating donor...`);

    // Security check
    const principalHeader = request.headers.get("x-ms-client-principal");
    if (!principalHeader) {
        return { status: 401, body: "Unauthorized" };
    }
    const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
    const roles = principal.userRoles || [];
    if (!roles.includes("admin") && !roles.includes("candidates-manager")) {
        return { status: 403, body: "Forbidden" };
    }

    try {
        const donorData = await request.json() as any;
        if (!donorData.email) {
            return { status: 400, body: "Email is required" };
        }

        const dbService = new DatabaseService();
        const updatedItem = await dbService.saveDonor(donorData);

        // Server-side logging
        const action = donorData.id ? 'donor_update' : 'donor_create';
        const metadata = donorData.phase ? { phase: donorData.phase } : undefined;
        await serverLogAction(request, action as any, donorData.email, metadata);

        return {
            status: 200,
            jsonBody: updatedItem
        };
    } catch (error: any) {
        context.error("Error updating donor:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('updateDonor', {
    methods: ['POST', 'PUT'],
    authLevel: 'anonymous',
    route: 'updateDonor',
    handler: updateDonor
});
