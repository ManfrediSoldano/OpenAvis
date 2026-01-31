import { DatabaseService } from '../services/database';
import { EmailService } from '../services/email';
import dotenv from 'dotenv';
dotenv.config();

async function testFlow() {
    console.log("--- Starting Full Flow Integration Test ---");

    // 1. Initialize Services
    let db: DatabaseService;
    let email: EmailService;

    try {
        db = new DatabaseService();
        console.log("✅ DB Service Initialized");
    } catch (e) { console.error("❌ DB Service Init Failed", e); return; }

    try {
        email = new EmailService();
        console.log("✅ Email Service Initialized");
    } catch (e) { console.warn("⚠️ Email Service Init Failed (Expected if credentials missing locally)", e); }

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
        const saved = await db.saveDonor(mockDonor);
        if (saved && saved.id) {
            console.log("✅ Donor Saved successfully. ID:", saved.id);
        } else {
            console.error("❌ Save returned no ID");
        }
    } catch (e: any) {
        console.error("❌ Failed to save donor:", e.message);
        // If fail, we might stop or continue to test email
    }

    // 4. Send Email
    if (email!) {
        console.log("\nStep 2: Sending Mock OTP...");
        try {
            const result = await email.sendOtp(mockDonor.email, "123456");
            console.log("✅ OTP Sent. MessageID:", (result as any).messageId);
        } catch (e: any) {
            console.error("❌ Failed to send OTP:", e.message);
        }
    } else {
        console.log("⚠️ Skipping Email test as Service not available");
    }

    console.log("\n--- Test Complete ---");
}

testFlow();
