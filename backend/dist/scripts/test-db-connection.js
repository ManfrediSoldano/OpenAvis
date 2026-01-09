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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmos_1 = require("@azure/cosmos");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing DB Connection...");
        const endpoint = process.env.COSMOS_DB_ENDPOINT;
        const key = process.env.COSMOS_DB_KEY;
        if (!endpoint || !key) {
            console.error("Missing Environment Variables. Cannot test.");
            return;
        }
        try {
            const client = new cosmos_1.CosmosClient({ endpoint, key });
            const { resource: dbAccount } = yield client.getDatabaseAccount();
            console.log("Successfully connected to Cosmos DB Account");
        }
        catch (e) {
            console.error("Connection failed:", e.message);
        }
    });
}
testConnection();
