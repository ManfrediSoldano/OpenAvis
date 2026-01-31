import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { EmailService } from "../services/email";

/**
 * POST /api/signup
 * Saves donor data and sends confirmation email
 */
export async function signup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const donorData = await request.json() as any;

        // Basic validation
        if (!donorData.email || !donorData.firstName || !donorData.lastName) {
            return {
                status: 400,
                jsonBody: { error: "Missing mandatory fields (email, firstName, lastName)" }
            };
        }

        // Save donor to database
        const dbService = new DatabaseService();
        const savedItem = await dbService.saveDonor(donorData);

        // Send confirmation email
        const emailService = new EmailService();
        try {
            await emailService.sendConfirmation(donorData.email);
        } catch (emailError) {
            context.error("Failed to send confirmation email:", emailError);
            // Continue anyway - donor is saved
        }

        context.log(`[Signup] Donor saved: ${donorData.email}`);

        return {
            status: 200,
            jsonBody: { success: true, data: savedItem }
        };
    } catch (error: any) {
        context.error("Error saving donor:", error);
        return {
            status: 500,
            jsonBody: { error: error.message || "Internal server error" }
        };
    }
}

app.http('signup', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'signup',
    handler: signup
});
