import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';
import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    getDocumentContent,
    generateFlashcards,
    getFlashcards,
    chatWithDocument,
    deleteDocument,
    getUserStats,
    generateQuiz,
    saveQuizResult,
    getAllUserFlashcards,
    generateRevisionPlan
} from '../controllers/docController.js';

import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Set up Storage (Safe Fallback)
// Use memory storage to process file buffer (PDF text extraction) before uploading to Cloudinary
const storage = multer.memoryStorage();

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

    try {
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.error("Multer/Cloudinary Error:", err);
                return res.status(500).json({ message: `Upload Error: ${err.message}` });
            }
            next();
        });
    } catch (multerError) {
        console.error("Multer caught error:", multerError);
        res.status(500).json({ message: `Upload Middleware Error: ${multerError.message}` });
    }
}, uploadDocument);

router.get('/stats', protect, getUserStats);
router.get('/flashcards/all', protect, getAllUserFlashcards);

router.route('/:id')
    .get(protect, getDocumentById)
    .delete(protect, deleteDocument);

router.get('/:id/content', protect, getDocumentContent);

router.post('/:id/flashcards', protect, generateFlashcards);
router.get('/:id/flashcards', protect, getFlashcards);
router.post('/:id/chat', protect, chatWithDocument);
router.post('/:id/quiz', protect, generateQuiz);
router.post('/:id/quiz/result', protect, saveQuizResult);
router.post('/:id/plan', protect, generateRevisionPlan);

export default router;
