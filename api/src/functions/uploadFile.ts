import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as multipart from "parse-multipart";
import { StorageService } from "../services/storage";
import { serverLogAction } from "../utils/authUtils";

export async function uploadFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Uploading file...`);

    // Security check
    const principalHeader = request.headers.get("x-ms-client-principal");
    if (!principalHeader) {
        return { status: 401, body: "Unauthorized" };
    }
    const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf-8"));
    const roles = principal.userRoles || [];
    if (!roles.includes("admin") && !roles.includes("news-editor")) {
        return { status: 403, body: "Forbidden" };
    }

    try {
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return { status: 400, body: "Invalid content type, expected multipart/form-data" };
        }

        const boundaryMatch = contentType.match(/boundary=(.+)/i);
        if (!boundaryMatch) {
            return { status: 400, body: "Missing boundary in content-type header" };
        }
        const boundary = boundaryMatch[1];

        const bodyArrayBuffer = await request.arrayBuffer();
        const bodyBuffer = Buffer.from(bodyArrayBuffer);
        
        const parts = multipart.Parse(bodyBuffer, boundary);
        if (!parts || parts.length === 0) {
            return { status: 400, body: "No file found in request" };
        }

        const filePart = parts[0];
        if (!filePart.data || !filePart.filename) {
            return { status: 400, body: "Invalid file part" };
        }

        // Add a timestamp to the filename to avoid collisions
        const fileName = `${Date.now()}-${filePart.filename}`;
        const fileType = filePart.type || 'application/octet-stream';

        const storageService = new StorageService();
        const fileUrl = await storageService.uploadFile(fileName, filePart.data, fileType);

        // Optional server-side logging
        await serverLogAction(request, 'news_update', undefined, { uploadedFileName: fileName });

        return {
            status: 200,
            jsonBody: { url: fileUrl }
        };
    } catch (error: any) {
        context.error("Error uploading file:", error);
        return {
            status: 500,
            body: error.message || "Internal Server Error"
        };
    }
}

app.http('uploadFile', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'uploadFile',
    handler: uploadFile
});
