import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { EmailService } from "../services/email";
import { Donor } from "../../../shared/models/donor";

/**
 * POST /api/signup
 * Saves donor data and sends confirmation email
 */
export async function signup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const body = await request.json() as any;
        const { otp, ...donorData } = body;

        // Basic validation
        if (!donorData.email || !donorData.firstName || !donorData.lastName) {
            return {
                status: 400,
                jsonBody: { error: "Missing mandatory fields (email, firstName, lastName)" }
            };
        }

        if (!otp) {
            return {
                status: 400,
                jsonBody: { error: "OTP code is required to complete signup" }
            };
        }

        const dbService = new DatabaseService();

        // Verify OTP
        const storedOtp = await dbService.getOtp(donorData.email);
        if (!storedOtp || storedOtp !== otp) {
            return {
                status: 400,
                jsonBody: { error: "Invalid or expired OTP" }
            };
        }

        // Consume OTP (prevent reuse)
        await dbService.deleteOtp(donorData.email);

        // Save donor to database
        const savedItem = await dbService.saveDonor(donorData);

        // Send confirmation email
        const emailService = new EmailService();
        try {
            await emailService.sendConfirmation(donorData.email, donorData.firstName);
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
