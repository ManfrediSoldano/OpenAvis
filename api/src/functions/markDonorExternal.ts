import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

export async function markDonorExternal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Marking donor as externally managed...`);

    // Security check
    const principalHeader = request.headers.get("x-ms-client-principal");
    let userEmail = "anonymous-internal";
    if (principalHeader) {
        try {
            const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
            userEmail = principal.userDetails || userEmail;
            const roles = principal.userRoles || [];
            if (!roles.includes("admin") && !roles.includes("candidates-manager")) {
                return { status: 403, body: "Forbidden" };
            }
        } catch (e) {
            return { status: 401, body: "Unauthorized" };
        }
    } else {
        return { status: 401, body: "Unauthorized" };
    }

    try {
        const body = await request.json() as { email?: string };
        if (!body || !body.email) {
            return { status: 400, body: "Email is required" };
        }

        const dbService = new DatabaseService();
        const existingDonor = await dbService.getDonor(body.email);

        if (!existingDonor) {
            return { status: 404, body: "Donor not found" };
        }

        const updatedDonor = {
            ...existingDonor,
            phase: 'gestito_esternamente',
            managedExternallyAt: new Date().toISOString()
        };

        const result = await dbService.saveDonor(updatedDonor);
        await dbService.saveAuditLog(userEmail, 'MARK_DONOR_EXTERNAL', body.email, { phase: 'gestito_esternamente' });

        return {
            status: 200,
            jsonBody: result
        };
    } catch (error: any) {
        context.error("Error marking donor external:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('markDonorExternal', {
    methods: ['POST', 'PUT'],
    authLevel: 'anonymous',
    route: 'markDonorExternal',
    handler: markDonorExternal
});
