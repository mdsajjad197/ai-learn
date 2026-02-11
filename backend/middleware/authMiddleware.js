import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

const logError = (msg) => {
    const logPath = path.join(process.cwd(), 'debug-log.txt');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
};

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            const errorMsg = `Auth Failed: User not found for ID: ${decoded.id}`;
            // logError(errorMsg);
            return res.status(401).json({ message: 'User not found.', code: 401 });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        // logError(`Auth Error: ${error.message}`);
        res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        // next(error); // Optional: if you want global handler to take over, but 401 is usually sufficient here.
    }
};
