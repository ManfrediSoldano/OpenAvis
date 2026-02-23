import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function getDonors(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Fetching all donors (Reserved area)...`);

    // --- DOUBLE CHECK SECURITY ---
    // Azure SWA platform protects the route, but as requested, 
    // we manually verify the roles from the header to prevent any bypass.
    const principalHeader = request.headers.get("x-ms-client-principal");
    if (!principalHeader) {
        return { status: 401, body: "Unauthorized" };
    }

    const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
    const roles = principal.userRoles || [];

    if (!roles.includes("admin") && !roles.includes("candidates-manager")) {
        return { status: 403, body: "Forbidden - Insufficient permissions" };
    }
    // ----------------------------

    try {
        const dbService = new DatabaseService();
        const donors = await dbService.getAllDonors();

        return {
            status: 200,
            jsonBody: donors
        };
    } catch (error) {
        context.log("Error fetching donors:", error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('getDonors', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getDonors
});
