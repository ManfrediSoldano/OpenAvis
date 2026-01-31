import { CosmosClient } from "@azure/cosmos";

export class DatabaseService {
    private client: CosmosClient;
    private databaseId: string;
    private containerId: string = "donors";

    constructor() {
        if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY || !process.env.COSMOS_DB_DATABASE) {
            console.warn("Cosmos DB environment variables missing. DatabaseService will fail if used.");
            // Throwing might break app startup if env vars are missing in local dev without .env, 
            // but usually we want to know. I'll throw if actually trying to connect.
            // For now, let's allow it to construct but methods will fail or we throw here.
        }

        this.client = new CosmosClient({
            endpoint: process.env.COSMOS_DB_ENDPOINT!,
            key: process.env.COSMOS_DB_KEY!
        });
        this.databaseId = process.env.COSMOS_DB_DATABASE!;
    }

    async saveDonor(donorData: any) {
        // Create DB/Container if not exists (Lazy initialization)
        const { database } = await this.client.databases.createIfNotExists({ id: this.databaseId });
        const { container } = await database.containers.createIfNotExists({ id: this.containerId, partitionKey: { paths: ["/email"] } });

        if (donorData.email) donorData.email = donorData.email.toLowerCase();

        // Add timestamp
        donorData.createdAt = new Date().toISOString();

        // Upsert
        const { resource: createdItem } = await container.items.upsert(donorData);
        return createdItem;
    }

    async getDonor(email: string) {
        if (!this.databaseId) return null;
        const database = this.client.database(this.databaseId);
        const container = database.container(this.containerId);
        // usage: container.item(id, partitionKey).read()
        const { resource } = await container.item(email, email).read();
        return resource;
    }
}
