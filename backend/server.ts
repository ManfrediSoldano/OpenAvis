import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Enable CORS for all routes
app.use(cors());

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

// Placeholder for a simple welcome message
app.get('/api', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the OpenAvis Backend!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});