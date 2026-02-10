import { CosmosClient } from "@azure/cosmos";
import { OtpDocument } from "../models/otp";

export class DatabaseService {
    private client: CosmosClient;
    private databaseId: string;
    private donorsContainerId: string = "donors";
    private otpsContainerId: string = "otps";
    private newsContainerId: string = "news";

    constructor() {
        if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY || !process.env.COSMOS_DB_DATABASE) {
            console.warn("Cosmos DB environment variables missing. DatabaseService will fail if used.");
        }

        this.client = new CosmosClient({
            endpoint: process.env.COSMOS_DB_ENDPOINT!,
            key: process.env.COSMOS_DB_KEY!
        });
        this.databaseId = process.env.COSMOS_DB_DATABASE!;
    }

    /**
     * Save donor data to Cosmos DB
     */
    async saveDonor(donorData: any) {
        // Create DB/Container if not exists (Lazy initialization)
        const { database } = await this.client.databases.createIfNotExists({ id: this.databaseId });
        const { container } = await database.containers.createIfNotExists({
            id: this.donorsContainerId,
            partitionKey: { paths: ["/email"] }
        });

        if (donorData.email) donorData.email = donorData.email.toLowerCase();

        // Add timestamp
        donorData.createdAt = new Date().toISOString();

        // Upsert
        const { resource: createdItem } = await container.items.upsert(donorData);
        return createdItem;
    }

    /**
     * Get donor by email
     */
    async getDonor(email: string) {
        if (!this.databaseId) return null;
        const database = this.client.database(this.databaseId);
        const container = database.container(this.donorsContainerId);

        try {
            const { resource } = await container.item(email.toLowerCase(), email.toLowerCase()).read();
            return resource;
        } catch (error: any) {
            if (error.code === 404) return null;
            throw error;
        }
    }

    /**
     * Save OTP to Cosmos DB with 5-minute TTL
     * @param email - User's email address
     * @param code - 6-digit OTP code
     */
    async saveOtp(email: string, code: string): Promise<void> {
        const { database } = await this.client.databases.createIfNotExists({ id: this.databaseId });

        // Create OTPs container with TTL enabled
        const { container } = await database.containers.createIfNotExists({
            id: this.otpsContainerId,
            partitionKey: { paths: ["/email"] },
            defaultTtl: -1  // Enable TTL, but require explicit value per document
        });

        const normalizedEmail = email.toLowerCase();
        const otpDoc: OtpDocument = {
            id: normalizedEmail,
            email: normalizedEmail,
            code,
            ttl: 300,  // 5 minutes
            createdAt: new Date().toISOString()
        };

        await container.items.upsert(otpDoc);
        console.log(`[OTP] Stored for ${email}: ${code} (TTL: 5min)`);
    }

    /**
     * Get and verify OTP from Cosmos DB
     * @param email - User's email address
     * @returns OTP code if found and valid, null otherwise
     */
    async getOtp(email: string): Promise<string | null> {
        if (!this.databaseId) return null;

        const database = this.client.database(this.databaseId);
        const container = database.container(this.otpsContainerId);
        const normalizedEmail = email.toLowerCase();

        try {
            const { resource } = await container.item(normalizedEmail, normalizedEmail).read<OtpDocument>();
            return resource?.code || null;
        } catch (error: any) {
            if (error.code === 404) return null;  // OTP not found or expired
            throw error;
        }
    }

    /**
     * Delete OTP after successful verification (consume OTP)
     * @param email - User's email address
     */
    async deleteOtp(email: string): Promise<void> {
        if (!this.databaseId) return;

        const database = this.client.database(this.databaseId);
        const container = database.container(this.otpsContainerId);
        const normalizedEmail = email.toLowerCase();

        try {
            await container.item(normalizedEmail, normalizedEmail).delete();
            console.log(`[OTP] Consumed and deleted for ${email}`);
        } catch (error: any) {
            if (error.code !== 404) {  // Ignore if already deleted
                console.warn(`[OTP] Failed to delete for ${email}:`, error);
            }
        }
    }
    /**
     * Get news highlights (latest 3 or flagged as highlights)
     */
    async getHighlights() {
        if (!this.databaseId) return [];
        const database = this.client.database(this.databaseId);
        const container = database.container(this.newsContainerId);

        try {
            // Query for highlights, order by date descending, take top 3
            // Note: In a real app, you might want to index 'date' or 'isHighlight'
            const querySpec = {
                query: "SELECT TOP 3 * FROM c WHERE c.isHighlight = true ORDER BY c.date DESC"
            };

            // If no highlights found, fallback to just latest 3? 
            // For now let's strict to isHighlight per requirements, or maybe just latest if user wants "news"
            // The requirement says "Ritorna 3 news fatte da..."

            const { resources } = await container.items.query(querySpec).fetchAll();
            return resources;
        } catch (error) {
            console.error("Error fetching highlights:", error);
            return [];
        }
    }

    /**
     * Get specific news by ID
     */
    async getNews(id: string) {
        if (!this.databaseId) return null;
        const database = this.client.database(this.databaseId);
        const container = database.container(this.newsContainerId);

        try {
            // Assuming id is the partition key or we just read by id. 
            // If we use /id as partition key, we can do item(id, id).
            // If we use something else, we might need a query.
            // Let's assume for News, 'id' is a good partition key or maybe 'type' if we had one.
            // For simplicity in this setup, let's use id.
            const { resource } = await container.item(id, id).read();
            return resource;
        } catch (error: any) {
            if (error.code === 404) return null;
            throw error;
        }
    }

    /**
     * Helper to seed/create news item (internal/admin use)
     */
    async createNews(newsItem: any) {
        const { database } = await this.client.databases.createIfNotExists({ id: this.databaseId });
        const { container } = await database.containers.createIfNotExists({
            id: this.newsContainerId,
            partitionKey: { paths: ["/id"] }
        });

        const { resource } = await container.items.upsert(newsItem);
        return resource;
    }
}
