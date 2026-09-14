import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { AccessLog } from "../../../shared/models/accessLog";
import { getPrincipal } from "../utils/authUtils";

export async function logAction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const principal = getPrincipal(request);
    if (!principal) {
        return { status: 401, body: "Unauthorized" };
    }

    const userId = principal.userId;
    const userDetails = principal.userDetails;

    try {
        const body = await request.json() as Partial<AccessLog>;
        
        if (!body.action) {
            return { status: 400, body: "Missing action" };
        }

        const logEntry: AccessLog = {
            userId: userId,
            userDetails: userDetails,
            action: body.action as any,
            targetId: body.targetId,
            metadata: body.metadata,
            timestamp: new Date().toISOString()
        };

        const dbService = new DatabaseService();
        await dbService.logAccess(logEntry);

        return { status: 200, body: "Logged" };
    } catch (error) {
        context.error("Error logging action:", error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('logAction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'reserved/logAction',
    handler: logAction
});
