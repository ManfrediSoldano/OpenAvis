import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DatabaseService } from './services/database';
import { EmailService } from './services/email';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Allow JSON body parsing

// Initialize Services
let dbService: DatabaseService;
let emailService: EmailService;

try {
    dbService = new DatabaseService();
    console.log("Database Service initialized");
} catch (e) {
    console.error("Failed to init DB Service:", e);
}

try {
    emailService = new EmailService();
    console.log("Email Service initialized");
} catch (e) { console.error("Failed to init Email Service:", e); }

// API endpoint to serve the configuration
app.get('/api/config', (req: Request, res: Response) => {
    const configPath = path.join(__dirname, 'config.json');
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading config file:", err);
            return res.status(500).json({ error: "Could not load configuration." });
        }
        res.json(JSON.parse(data));
    });
});

// In-memory OTP store (Use Redis/Database for production)
export const otpStore: Record<string, string> = {};

// Send OTP Endpoint
app.post('/api/send-otp', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to store
        otpStore[email] = otp;
        console.log(`[OTP] Stored for ${email}: ${otp}`);

        if (emailService) {
            await emailService.sendOtp(email, otp);
            // Temporary hack: Log OTP so developer can see it if email fails in dev
            console.log(`[DEV] OTP for ${email}: ${otp}`);
        } else {
            console.log(`[MOCK] Email Service missing. OTP for ${email}: ${otp}`);
        }

        res.json({ success: true, message: "OTP sent" });
    } catch (err: any) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ error: err.message });
    }
});

// Verify OTP Endpoint
app.post('/api/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

        const storedOtp = otpStore[email];

        if (storedOtp && storedOtp === otp) {
            delete otpStore[email]; // Consume OTP
            return res.json({ success: true, message: "OTP verified" });
        } else {
            return res.status(400).json({ success: false, error: "Invalid OTP" });
        }
    } catch (err: any) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({ error: err.message });
    }
});

// Signup Endpoint
// Updated to actually match FormState interface
app.post('/api/signup', async (req: Request, res: Response) => {
    try {
        const donorData = req.body;
        // Basic validation
        if (!donorData.email || !donorData.firstName || !donorData.lastName) {
            return res.status(400).json({ error: "Missing mandatory fields" });
        }

        if (dbService) {
            const savedItem = await dbService.saveDonor(donorData);

            // Send Confirmation Email
            if (emailService) {
                // Fire and forget or wait? Better wait to confirm.
                await emailService.sendConfirmation(donorData.email).catch(e => console.error("Failed to send confirmation email", e));
            }

            return res.json({ success: true, data: savedItem });
        } else {
            console.log("[MOCK] DB Service missing. Would save:", donorData);
            return res.json({ success: true, message: "Mock saved", data: donorData });
        }

    } catch (err: any) {
        console.error("Error saving donor:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the OpenAvis Backend!' });
});

export default app;
