import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as fs from "fs";
import * as path from "path";

/**
 * GET /api/config
 * Returns the association configuration
 */
export async function config(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const configPath = path.join(process.cwd(), 'config.json');

        if (!fs.existsSync(configPath)) {
            context.error("config.json not found");
            return {
                status: 500,
                jsonBody: { error: "Configuration file not found" }
            };
        }

        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);

        return {
            status: 200,
            jsonBody: config
        };
    } catch (error: any) {
        context.error("Error reading config:", error);
        return {
            status: 500,
            jsonBody: { error: "Could not load configuration" }
        };
    }
}

app.http('config', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'config',
    handler: config
});
