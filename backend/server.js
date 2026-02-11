import './polyfills.js'; // Must be first
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import adminRoutes from './routes/admin.js';
import efficiencyRoutes from './routes/efficiency.js';

dotenv.config();

// Connect to Database
// Connect to Database
// connectDB(); // Removed immediate call for serverless

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure DB is connected for every request (Serverless pattern)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Database Connection Failed" });
    }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
// Serve uploads statically if folder exists (for legacy/local support)
import fs from 'fs';
const uploadsPath = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsPath)) {
    app.use('/uploads', express.static(uploadsPath));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/efficiency', efficiencyRoutes);

app.get('/', (req, res) => res.send('API Running'));

if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        console.log("SERVER VERSION: 2.1 (PDF PARSER RENAMED)");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}

// Global Error Handler (MUST be last)
// Global Error Handler (MUST be last)
// Global Error Handler (MUST be last)
app.use((err, req, res, next) => {
    console.error("🔥 GLOBAL ERROR HANDLER:", err);
    try {
        const logPath = path.join(process.cwd(), 'debug_error.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${err.stack || err.message}\n`);
    } catch (e) { console.error("Failed to write to log", e); }

    res.status(500).json({
        message: "Server Error (Global Handler)",
        error: err.message,
        stack: err.stack // Always return stack for debugging
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    try {
        const logPath = path.join(process.cwd(), 'debug_error.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Unhandled Rejection: ${reason}\n`);
    } catch (e) { }
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    try {
        const logPath = path.join(process.cwd(), 'debug_error.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Uncaught Exception: ${err.message}\n${err.stack}\n`);
    } catch (e) { }
    // process.exit(1); // Optional: restart process
});

export default app;
