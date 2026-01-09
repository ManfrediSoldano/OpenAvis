"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const cosmos_1 = require("@azure/cosmos");
class DatabaseService {
    constructor() {
        this.containerId = "donors";
        if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY || !process.env.COSMOS_DB_DATABASE) {
            console.warn("Cosmos DB environment variables missing. DatabaseService will fail if used.");
            // Throwing might break app startup if env vars are missing in local dev without .env, 
            // but usually we want to know. I'll throw if actually trying to connect.
            // For now, let's allow it to construct but methods will fail or we throw here.
        }
        this.client = new cosmos_1.CosmosClient({
            endpoint: process.env.COSMOS_DB_ENDPOINT,
            key: process.env.COSMOS_DB_KEY
        });
        this.databaseId = process.env.COSMOS_DB_DATABASE;
    }
    saveDonor(donorData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create DB/Container if not exists (Lazy initialization)
            const { database } = yield this.client.databases.createIfNotExists({ id: this.databaseId });
            const { container } = yield database.containers.createIfNotExists({ id: this.containerId, partitionKey: { paths: ["/email"] } });
            if (donorData.email)
                donorData.email = donorData.email.toLowerCase();
            // Add timestamp
            donorData.createdAt = new Date().toISOString();
            // Upsert
            const { resource: createdItem } = yield container.items.upsert(donorData);
            return createdItem;
        });
    }
    getDonor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.databaseId)
                return null;
            const database = this.client.database(this.databaseId);
            const container = database.container(this.containerId);
            // usage: container.item(id, partitionKey).read()
            const { resource } = yield container.item(email, email).read();
            return resource;
        });
    }
}
exports.DatabaseService = DatabaseService;
