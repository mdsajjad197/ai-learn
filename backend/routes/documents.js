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

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'antigravity-docs',
        resource_type: (req, file) => {
            return file.mimetype === 'application/pdf' ? 'raw' : 'auto';
        },
        public_id: (req, file) => {
            // For raw files, extension is crucial. For images, it's optional but good practice.
            const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
            const ext = path.extname(file.originalname);
            return `${Date.now()}-${name}${ext}`;
        },
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'txt', 'md'],
        access_mode: 'public'
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB
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

router.post('/upload', protect, upload.single('file'), uploadDocument);

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
