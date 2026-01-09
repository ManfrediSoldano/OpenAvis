import { CosmosClient } from "@azure/cosmos";
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
    console.log("Testing DB Connection...");
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;

    if (!endpoint || !key) {
        console.error("Missing Environment Variables. Cannot test.");
        return;
    }

    try {
        const client = new CosmosClient({ endpoint, key });
        const { resource: dbAccount } = await client.getDatabaseAccount();
        console.log("Successfully connected to Cosmos DB Account");
    } catch (e: any) {
        console.error("Connection failed:", e.message);
    }
}

testConnection();
