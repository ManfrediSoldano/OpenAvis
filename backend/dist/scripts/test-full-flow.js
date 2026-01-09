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
const database_1 = require("../services/database");
const email_1 = require("../services/email");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function testFlow() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("--- Starting Full Flow Integration Test ---");
        // 1. Initialize Services
        let db;
        let email;
        try {
            db = new database_1.DatabaseService();
            console.log("✅ DB Service Initialized");
        }
        catch (e) {
            console.error("❌ DB Service Init Failed", e);
            return;
        }
        try {
            email = new email_1.EmailService();
            console.log("✅ Email Service Initialized");
        }
        catch (e) {
            console.warn("⚠️ Email Service Init Failed (Expected if credentials missing locally)", e);
        }
        // 2. Simulate Donor Data
        const mockDonor = {
            firstName: "Mario",
            lastName: "Rossi",
            email: "mario.rossi@example.com",
            age: 30,
            weight: 75,
            location: "Merate",
            test_id: "integration-test-" + Date.now()
        };
        // 3. Save to DB
        console.log("\nStep 1: Saving Donor to DB...");
        try {
            const saved = yield db.saveDonor(mockDonor);
            if (saved && saved.id) {
                console.log("✅ Donor Saved successfully. ID:", saved.id);
            }
            else {
                console.error("❌ Save returned no ID");
            }
        }
        catch (e) {
            console.error("❌ Failed to save donor:", e.message);
            // If fail, we might stop or continue to test email
        }
        // 4. Send Email
        if (email) {
            console.log("\nStep 2: Sending Mock OTP...");
            try {
                const result = yield email.sendOtp(mockDonor.email, "123456");
                console.log("✅ OTP Sent. MessageID:", result.messageId);
            }
            catch (e) {
                console.error("❌ Failed to send OTP:", e.message);
            }
        }
        else {
            console.log("⚠️ Skipping Email test as Service not available");
        }
        console.log("\n--- Test Complete ---");
    });
}
testFlow();
