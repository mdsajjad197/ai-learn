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

const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
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
