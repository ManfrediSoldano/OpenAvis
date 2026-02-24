import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { EmailService } from "../services/email";
import { Donor } from "../../../shared/models/donor";

export async function sendConvocation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Sending convocation email...`);

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
        const { email, convocationDate } = await request.json() as { email: string, convocationDate: string };

        if (!email || !convocationDate) {
            return { status: 400, body: "Email and convocationDate are required" };
        }

        const dbService = new DatabaseService();
        const donor = await dbService.getDonor(email);

        if (!donor) {
            return { status: 404, body: "Donor not found" };
        }

        const emailService = new EmailService();
        try {
            await emailService.sendConvocation(email, donor.firstName, convocationDate);

            // Update donor status in DB
            donor.convocationDate = convocationDate;
            donor.convocationStatus = 'sent';
            await dbService.saveDonor(donor);

            return {
                status: 200,
                jsonBody: { success: true }
            };
        } catch (emailError: any) {
            context.error("Failed to send convocation email:", emailError);

            // Mark as error in DB
            donor.convocationDate = convocationDate;
            donor.convocationStatus = 'error';
            await dbService.saveDonor(donor);

            return {
                status: 500,
                jsonBody: { error: "Failed to send email", details: emailError.message }
            };
        }
    } catch (error: any) {
        context.error("Error in sendConvocation:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('sendConvocation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'sendConvocation',
    handler: sendConvocation
});
