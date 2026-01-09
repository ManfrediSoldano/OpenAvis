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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./services/database");
const email_1 = require("./services/email");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
// Enable CORS for all routes
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Allow JSON body parsing
// Initialize Services
let dbService;
let emailService;
try {
    dbService = new database_1.DatabaseService();
    console.log("Database Service initialized");
}
catch (e) {
    console.error("Failed to init DB Service:", e);
}
try {
    emailService = new email_1.EmailService();
    console.log("Email Service initialized");
}
catch (e) {
    console.error("Failed to init Email Service:", e);
}
// API endpoint to serve the configuration
app.get('/api/config', (req, res) => {
    const configPath = path_1.default.join(__dirname, 'config.json');
    fs_1.default.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading config file:", err);
            return res.status(500).json({ error: "Could not load configuration." });
        }
        res.json(JSON.parse(data));
    });
});
// In-memory OTP store (Use Redis/Database for production)
const otpStore = {};
// Send OTP Endpoint
app.post('/api/send-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email required" });
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Save to store
        otpStore[email] = otp;
        console.log(`[OTP] Stored for ${email}: ${otp}`);
        if (emailService) {
            yield emailService.sendOtp(email, otp);
            // Temporary hack: Log OTP so developer can see it if email fails in dev
            console.log(`[DEV] OTP for ${email}: ${otp}`);
        }
        else {
            console.log(`[MOCK] Email Service missing. OTP for ${email}: ${otp}`);
        }
        res.json({ success: true, message: "OTP sent" });
    }
    catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ error: err.message });
    }
}));
// Verify OTP Endpoint
app.post('/api/verify-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ error: "Email and OTP required" });
        const storedOtp = otpStore[email];
        if (storedOtp && storedOtp === otp) {
            delete otpStore[email]; // Consume OTP
            return res.json({ success: true, message: "OTP verified" });
        }
        else {
            return res.status(400).json({ success: false, error: "Invalid OTP" });
        }
    }
    catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({ error: err.message });
    }
}));
// Signup Endpoint
// Updated to actually match FormState interface
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donorData = req.body;
        // Basic validation
        if (!donorData.email || !donorData.firstName || !donorData.lastName) {
            return res.status(400).json({ error: "Missing mandatory fields" });
        }
        if (dbService) {
            const savedItem = yield dbService.saveDonor(donorData);
            // Send Confirmation Email
            if (emailService) {
                // Fire and forget or wait? Better wait to confirm.
                yield emailService.sendConfirmation(donorData.email).catch(e => console.error("Failed to send confirmation email", e));
            }
            return res.json({ success: true, data: savedItem });
        }
        else {
            console.log("[MOCK] DB Service missing. Would save:", donorData);
            return res.json({ success: true, message: "Mock saved", data: donorData });
        }
    }
    catch (err) {
        console.error("Error saving donor:", err);
        res.status(500).json({ error: err.message });
    }
}));
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the OpenAvis Backend!' });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
