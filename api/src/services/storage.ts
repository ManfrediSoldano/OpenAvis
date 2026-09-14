import { BlobServiceClient } from "@azure/storage-blob";

export class StorageService {
    private blobServiceClient: BlobServiceClient;
    private containerName = "public-assets";

    constructor() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            console.error("AZURE_STORAGE_CONNECTION_STRING environment variable is missing.");
            // Provide a dummy connection string or throw. For local dev without it, it will fail on use.
            this.blobServiceClient = BlobServiceClient.fromConnectionString("UseDevelopmentStorage=true");
        } else {
            this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        }
    }

    /**
     * Uploads a file to Azure Blob Storage
     * @param fileName The name of the file to save
     * @param buffer The file content as a Buffer
     * @param contentType The mime type of the file
     * @returns The public URL of the uploaded blob
     */
    async uploadFile(fileName: string, buffer: Buffer, contentType: string): Promise<string> {
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        
        // Ensure container exists and is public
        await containerClient.createIfNotExists({ access: 'blob' });

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        
        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: contentType }
        });

        return blockBlobClient.url;
    }
}
