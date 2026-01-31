import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";

/**
 * POST /api/verify-otp
 * Verifies the OTP code for the provided email
 */
export async function verifyOtp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const body = await request.json() as { email?: string; otp?: string };
        const { email, otp } = body;

        if (!email || !otp) {
            return {
                status: 400,
                jsonBody: { error: "Email and OTP required" }
            };
        }

        // Retrieve OTP from Cosmos DB
        const dbService = new DatabaseService();
        const storedOtp = await dbService.getOtp(email);

        if (!storedOtp) {
            context.warn(`[OTP] No OTP found for ${email} (expired or never created)`);
            return {
                status: 400,
                jsonBody: { success: false, error: "Invalid or expired OTP" }
            };
        }

        // Verify OTP
        if (storedOtp === otp) {
            // Consume OTP (delete after successful verification)
            await dbService.deleteOtp(email);
            context.log(`[OTP] Verified and consumed for ${email}`);

            return {
                status: 200,
                jsonBody: { success: true, message: "OTP verified" }
            };
        } else {
            context.warn(`[OTP] Invalid OTP for ${email}`);
            return {
                status: 400,
                jsonBody: { success: false, error: "Invalid OTP" }
            };
        }
    } catch (error: any) {
        context.error("Error verifying OTP:", error);
        return {
            status: 500,
            jsonBody: { error: error.message || "Internal server error" }
        };
    }
}

app.http('verifyOtp', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'verify-otp',
    handler: verifyOtp
});
