"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
// Enable CORS for all routes
app.use((0, cors_1.default)());
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
// Placeholder for a simple welcome message
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the OpenAvis Backend!' });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
