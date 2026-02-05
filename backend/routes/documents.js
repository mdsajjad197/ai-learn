import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';
import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    generateFlashcards,
    getFlashcards,
    chatWithDocument,
    deleteDocument,
    getUserStats,
    generateQuiz,
    saveQuizResult,
    getAllUserFlashcards
} from '../controllers/docController.js';

import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Set up Storage (Safe Fallback)
let storage;
if (cloudinary.isConfigured) {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'antigravity-docs',
            resource_type: (req, file) => file.mimetype === 'application/pdf' ? 'raw' : 'auto',
            public_id: (req, file) => {
                const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
                const ext = path.extname(file.originalname);
                return `${Date.now()}-${name}${ext}`;
            },
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'txt', 'md'],
        },
    });
} else {
    // Fallback to memory storage to prevent server crash on startup
    console.warn("⚠️ Cloudinary not configured. Using MemoryStorage (Uploads will fail safely).");
    storage = multer.memoryStorage();
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|txt|md|json|csv|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype || extname) {
        return cb(null, true);
    } else {
        cb('Error: Check File Type!');
    }
}

router.route('/')
    .get(protect, getDocuments);

router.post('/upload', protect, (req, res, next) => {
    // Runtime check for configuration
    if (!cloudinary.isConfigured) {
        return res.status(500).json({
            message: "Server Error: Cloudinary API Keys are missing in Vercel Environment Variables. Please add CLOUDINARY_CLOUD_NAME, _API_KEY, and _API_SECRET."
        });
    }

    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error("Multer/Cloudinary Error:", err);
            return res.status(500).json({ message: `Upload Error: ${err.message}` });
        }
        next();
    });
}, uploadDocument);

router.get('/stats', protect, getUserStats);
router.get('/flashcards/all', protect, getAllUserFlashcards);

router.route('/:id')
    .get(protect, getDocumentById)
    .delete(protect, deleteDocument);

router.post('/:id/flashcards', protect, generateFlashcards);
router.get('/:id/flashcards', protect, getFlashcards);
router.post('/:id/chat', protect, chatWithDocument);
router.post('/:id/quiz', protect, generateQuiz);
router.post('/:id/quiz/result', protect, saveQuizResult);

export default router;
