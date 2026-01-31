import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { EmailService } from "../services/email";

/**
 * POST /api/send-otp
 * Generates and sends an OTP to the provided email
 */
export async function sendOtp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const body = await request.json() as { email?: string };
        const { email } = body;

        if (!email) {
            return {
                status: 400,
                jsonBody: { error: "Email required" }
            };
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to Cosmos DB with 5-minute TTL
        const dbService = new DatabaseService();
        await dbService.saveOtp(email, otp);

        // Send OTP via email (or log in dev mode)
        const emailService = new EmailService();
        await emailService.sendOtp(email, otp);

        // Log for development (email service already logs in dev mode)
        context.log(`[OTP] Generated for ${email}: ${otp}`);

        return {
            status: 200,
            jsonBody: { success: true, message: "OTP sent" }
        };
    } catch (error: any) {
        context.error("Error sending OTP:", error);
        return {
            status: 500,
            jsonBody: { error: error.message || "Internal server error" }
        };
    }
}

app.http('sendOtp', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'send-otp',
    handler: sendOtp
});
