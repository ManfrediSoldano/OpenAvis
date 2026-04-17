import { HttpRequest } from "@azure/functions";
import { DatabaseService } from "../services/database";
import { LogAction } from "../../../shared/models/accessLog";

export function getPrincipal(request: HttpRequest) {
    const principalHeader = request.headers.get("x-ms-client-principal");
    if (!principalHeader) return null;
    return JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
}

export async function serverLogAction(request: HttpRequest, action: LogAction, targetId?: string, metadata?: any) {
    const principal = getPrincipal(request);
    if (!principal) return;

    const dbService = new DatabaseService();
    await dbService.logAccess({
        userId: principal.userId,
        userDetails: principal.userDetails,
        action,
        targetId,
        metadata,
        timestamp: new Date().toISOString()
    });
}
