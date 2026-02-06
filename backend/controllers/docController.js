import Document from '../models/Document.js';
import FlashcardSet from '../models/FlashcardSet.js';
import QuizResult from '../models/QuizResult.js';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import { generateChatResponse as aiGenerateChat, generateFlashcards as aiGenerateCards, generateQuiz as aiGenerateQuiz } from '../services/aiService.js';
import pdf from '../utils/pdfParser.js';

// @desc    Delete a document
// @route   DELETE /api/documents/:id
export const deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check user
        if (doc.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Delete file from Cloudinary
        if (doc.publicId) {
            try {
                await cloudinary.uploader.destroy(doc.publicId);
            } catch (err) {
                console.error("Failed to delete file from Cloudinary:", err);
            }
        }

        // Delete associated flashcards
        await FlashcardSet.deleteMany({ docId: doc._id });

        // Delete document from DB
        await doc.deleteOne();

        res.json({ id: req.params.id, message: 'Document removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload a document
// @route   POST /api/documents/upload
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // With Cloudinary storage, stats like size might be in req.file.size or need to be calculated
        const fileSizeInBytes = req.file.size || 0;
        const fileSize = (fileSizeInBytes / 1024).toFixed(2) + ' KB';

        let extractedText = "No textual content extracted.";

        if (req.file.mimetype === 'application/pdf') {
            try {
                console.log("[DEBUG] Uploaded File Details:", {
                    filename: req.file.filename,
                    path: req.file.path,
                    mimetype: req.file.mimetype
                });

                // Use the URL returned directly by Cloudinary upload (guaranteed to be valid)
                // We previously tried to generate a signed URL here, but it caused 401 errors due to path mismatches.
                // Since access_mode is 'public', req.file.path is accessible.
                // FIX: Use explicitly signed URL for raw resource to ensure access
                const downloadUrl = cloudinary.url(req.file.filename, {
                    resource_type: 'raw',
                    type: 'upload',
                    sign_url: true
                });
                console.log(`Downloading PDF from Signed URL: ${downloadUrl}`);

                const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

                // Verify we didn't download an error page (HTML)
                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('text/html')) {
                    throw new Error("Failed to download PDF: Received HTML error page from Cloudinary (likely 404 or 401)");
                }

                const dataBuffer = Buffer.from(response.data);

                const data = await pdf(dataBuffer);
                extractedText = data.text;

            } catch (pError) {
                console.error("PDF Parsing Failed:", pError);
                extractedText = `Error extracting text from PDF: ${pError.message}`;
            }
        }

        const doc = await Document.create({
            name: req.body.name || req.file.originalname,
            fileName: req.file.filename, // This is the public_id in Cloudinary storage
            type: req.file.mimetype,
            size: fileSize,
            url: req.file.path, // Cloudinary URL
            publicId: req.file.filename, // Store public_id explicitly
            owner: req.user._id,
            content: extractedText
        });

        res.status(201).json(doc);
    } catch (error) {
        console.error("Upload Error:", error);
        console.error("Req File:", req.file);
        res.status(500).json({ message: `Upload Error: ${error.message}` });
    }
};

// @desc    Get all documents for user
// @route   GET /api/documents
export const getDocuments = async (req, res) => {
    try {
        const docs = await Document.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user stats for dashboard
// @route   GET /api/documents/stats
export const getUserStats = async (req, res) => {
    try {
        // 1. Count documents owned by user
        const docCount = await Document.countDocuments({ owner: req.user._id });

        // 2. Count flashcards for those documents
        // Since FlashcardSet doesn't have an owner field, we first find all doc IDs for the user
        const userDocs = await Document.find({ owner: req.user._id }).select('_id');
        const userDocIds = userDocs.map(doc => doc._id);

        const cardCount = await FlashcardSet.countDocuments({ docId: { $in: userDocIds } });

        // 3. Mock quizzes for now (or implement similar logic if Quiz model existed)
        // 3. Count quizzes taken
        const quizCount = await QuizResult.countDocuments({ user: req.user._id });

        res.json({
            documents: docCount,
            flashcards: cardCount,
            quizzes: quizCount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single document details
// @route   GET /api/documents/:id
export const getDocumentById = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        if (doc.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Generate a fresh signed URL for the frontend to view/download details
        // Determine resource type based on stored URL (legacy files might be 'image', new ones 'raw')
        const resourceType = doc.url.includes('/image/') ? 'image' : 'raw';

        // Generate a fresh signed URL for the frontend to view/download details
        const signedUrl = cloudinary.url(doc.fileName, {
            resource_type: resourceType,
            type: 'upload',
            sign_url: true,
            // flags: 'attachment' // Do NOT use attachment flag for preview URL
        });

        // Return doc object but with the signed URL for access
        const docResponse = doc.toObject();
        docResponse.url = signedUrl;

        res.json(docResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Flashcards
// @route   POST /api/documents/:id/flashcards
export const generateFlashcards = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        const cards = await aiGenerateCards(doc.content, doc.name);

        const set = await FlashcardSet.create({
            docId: doc.id,
            docName: doc.name,
            topic: `Study Set: ${doc.name}`,
            cards: cards
        });

        res.json(set);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI generation failed' });
    }
};

// @desc    Get Flashcards for Document
// @route   GET /api/documents/:id/flashcards
export const getFlashcards = async (req, res) => {
    try {
        const sets = await FlashcardSet.find({ docId: req.params.id });
        res.json(sets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Flashcards for User
// @route   GET /api/documents/flashcards/all
export const getAllUserFlashcards = async (req, res) => {
    try {
        // Find all doc IDs for the user
        const userDocs = await Document.find({ owner: req.user._id }).select('_id');
        const userDocIds = userDocs.map(doc => doc._id);

        // Find all flashcard sets linked to these docs
        const sets = await FlashcardSet.find({ docId: { $in: userDocIds } }).sort({ createdAt: -1 });

        res.json(sets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Chat with Document
// @route   POST /api/documents/:id/chat
export const chatWithDocument = async (req, res) => {
    try {
        const { message } = req.body;
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        console.log(`[Chat Debug] Doc ID: ${doc._id}`);
        console.log(`[Chat Debug] Doc Name: ${doc.name}`);
        console.log(`[Chat Debug] Content Length: ${doc.content ? doc.content.length : 'N/A'}`);
        console.log(`[Chat Debug] Content Preview: ${doc.content ? doc.content.substring(0, 100) : 'None'}`);

        const response = await aiGenerateChat(doc.content, message);
        res.json({ response });
    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};
// @desc    Generate Quiz
// @route   POST /api/documents/:id/quiz
export const generateQuiz = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        const quiz = await aiGenerateQuiz(doc.content, doc.name);
        res.json(quiz);
    } catch (error) {
        console.error("Generate Quiz Error:", error);
        res.status(500).json({ message: 'AI generation failed: ' + error.message });
    }
};

// @desc    Save Quiz Result
// @route   POST /api/documents/:id/quiz/result
export const saveQuizResult = async (req, res) => {
    try {
        const { score, totalQuestions } = req.body;

        const result = await QuizResult.create({
            user: req.user._id,
            docId: req.params.id,
            score,
            totalQuestions,
            percentage: (score / totalQuestions) * 100
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Save Quiz Error:", error);
        res.status(500).json({ message: 'Failed to save result' });
    }
};
