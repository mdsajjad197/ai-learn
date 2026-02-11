import Document from '../models/Document.js';
import FlashcardSet from '../models/FlashcardSet.js';
import QuizResult from '../models/QuizResult.js';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import { generateChatResponse as aiGenerateChat, generateFlashcards as aiGenerateCards, generateQuiz as aiGenerateQuiz, generateRevisionPlan as aiGenerateRevisionPlan } from '../services/aiService.js';
import pdf from '../utils/pdfParser.js';

// @desc    Delete a document
// @route   DELETE /api/documents/:id
export const deleteDocument = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
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
// @desc    Upload a document
// @route   POST /api/documents/upload
// @desc    Upload a document
// @route   POST /api/documents/upload
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req, res) => {
    // Use console logging for serverless environments where file system is read-only
    const log = (msg) => {
        const timestamp = new Date().toISOString();
        console.log(`[UPLOAD_DEBUG] ${timestamp} ${msg}`);
    };

    try {
        log("Upload started.");
        if (!req.file) {
            log("No file uploaded.");
            return res.status(400).json({ message: 'No file uploaded' });
        }

        log(`File received: ${req.file.originalname}, Mimetype: ${req.file.mimetype}, Size: ${req.file.size}`);

        const fileSizeInBytes = req.file.size || 0;
        const fileSize = (fileSizeInBytes / 1024).toFixed(2) + ' KB';
        let extractedText = "No textual content extracted.";

        // 1. Extract Text from Buffer (No download needed!)
        if (req.file.mimetype === 'application/pdf') {
            try {
                log("Processing PDF buffer for text extraction...");
                console.log("[DEBUG] Processing PDF from Buffer...");
                const data = await pdf(req.file.buffer);
                extractedText = data.text;

                log(`Extraction done. Text length: ${extractedText ? extractedText.length : 0}`);

                // Basic validation: if text is empty, maybe generation failed?
                if (!extractedText || extractedText.trim().length === 0) {
                    log("WARN: Extracted text is empty.");
                    console.warn("[WARN] PDF extracted text is empty.");
                    extractedText = "No readable text found in PDF.";
                }
            } catch (pError) {
                log(`ERROR: Parsing failed: ${pError.message}`);
                console.error("PDF Parsing Failed:", pError);
                extractedText = `Error extracting text from PDF: ${pError.message}`;
            }
        }

        // 2. Upload to Cloudinary (Stream Upload)
        const uploadToCloudinary = (buffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'antigravity-docs',
                        resource_type: 'auto',
                        public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`, // Keep extension for raw files
                        type: 'authenticated' // Store as private/authenticated to avoid public delivery blocks
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Callback Error:", error);
                            return reject(error);
                        }
                        resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
        };

        log("Starting Cloudinary upload...");
        let cloudResult;
        try {
            cloudResult = await uploadToCloudinary(req.file.buffer);
        } catch (cErr) {
            log(`Cloudinary Upload Failed: ${cErr.message}`);
            throw new Error(`Cloudinary Upload Failed: ${cErr.message}`);
        }

        log(`Cloudinary upload success. URL: ${cloudResult.secure_url}, PublicID: ${cloudResult.public_id}, Type: ${cloudResult.resource_type}`);

        console.log(`[DEBUG] Cloudinary Upload Success: ${cloudResult.secure_url}`);

        // 3. Save to DB
        const doc = await Document.create({
            name: req.body.name || req.file.originalname,
            fileName: cloudResult.public_id,
            type: req.file.mimetype,
            size: fileSize,
            url: cloudResult.secure_url,
            publicId: cloudResult.public_id,
            owner: req.user._id,
            content: extractedText
        });

        log(`Document saved to DB. ID: ${doc._id}`);
        // Transform for response
        const docResponse = doc.toObject();
        docResponse.url = `/api/documents/${doc._id}/content`;
        res.status(201).json(docResponse);

    } catch (error) {
        log(`FATAL ERROR: ${error.message} \nStack: ${error.stack}`);
        console.error("Upload Error:", error);
        res.status(500).json({ message: `Upload Error: ${error.message}`, stack: error.stack });
    }
};

// @desc    Get all documents for user
// @route   GET /api/documents
export const getDocuments = async (req, res) => {
    try {
        const log = (msg) => console.log(`[getDocuments] ${new Date().toISOString()} ${msg}`);

        const docs = await Document.find({ owner: req.user._id }).sort({ createdAt: -1 });
        log(`Found ${docs.length} documents for user ${req.user.id}`);

        const transformedDocs = docs.map(doc => {
            const d = doc.toObject();
            d.url = `/api/documents/${doc._id}/content`;
            return d;
        });
        res.json(transformedDocs);
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
// @desc    Get document content (Proxy)
// @route   GET /api/documents/:id/content


export const getDocumentContent = async (req, res) => {
    try {
        const log = (msg) => console.log(`[PROXY_DEBUG] ${new Date().toISOString()} ${msg}`);

        const isConfigured = cloudinary.config().api_secret;
        log(`Cloudinary Configured: ${!!isConfigured} (Cloud: ${cloudinary.config().cloud_name})`);

        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        if (doc.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Generate a signed URL for internal fetching
        // Determine resource type based on stored type or URL
        // PDFs can be 'image' (if paged) or 'raw'
        // Images are 'image'
        // Other files are 'raw'
        let resourceType = 'raw';
        if (doc.type && doc.type.startsWith('image/')) {
            resourceType = 'image';
        } else if (doc.type === 'application/pdf') {
            // Try 'raw' first as it's the default for auto-upload of PDFs usually
            resourceType = 'raw';
        }

        const fetchContent = async (type) => {
            const urlOptions = {
                resource_type: type,
                type: 'authenticated',
                secure: true
            };

            // If fetching PDF as image, we might need format if it was converted
            if (doc.type === 'application/pdf' && type === 'image') {
                urlOptions.format = 'pdf';
            }

            // private_download_url is more reliable for server-side fetching of authenticated resources
            // Cloudinary utils.private_download_url signatures are sensitive to parameters.

            const signedUrl = cloudinary.utils.private_download_url(doc.fileName, urlOptions.format || '', {
                ...urlOptions
            });

            log(`Fetching ID: ${doc._id}, Type: ${type}, SignedURL: ${signedUrl}`);

            return await axios({
                url: signedUrl,
                method: 'GET',
                responseType: 'stream',
                timeout: 10000
            });
        };

        let response;
        try {
            response = await fetchContent(resourceType);
        } catch (error) {
            log(`First attempt failed (${resourceType}): ${error.message}`);
            // Fallback: If image failed, try raw. If raw failed, try image.
            const fallbackType = resourceType === 'image' ? 'raw' : 'image';
            log(`Trying fallback: ${fallbackType}`);
            response = await fetchContent(fallbackType);
        }

        // Pipe headers and data
        // Force application/pdf for PDFs, otherwise trust Cloudinary or DB type
        const contentType = doc.type === 'application/pdf' ? 'application/pdf' : (response.headers['content-type'] || doc.type);
        res.setHeader('Content-Type', contentType);
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }
        res.setHeader('Content-Disposition', `inline; filename="${doc.name}"`);

        response.data.pipe(res);

    } catch (error) {
        const log = (msg) => console.log(`[PROXY_ERROR] ${new Date().toISOString()} ${msg}`);
        log(`Fatal: ${error.message} ${error.response ? `(Status: ${error.response.status})` : ''}`);

        console.error("Proxy Error:", error.message);
        if (error.response) {
            return res.status(error.response.status).send(`Cloudinary Error: ${error.response.statusText}`);
        }
        res.status(500).json({ message: 'Failed to fetch document content' });
    }
};

// @desc    Get single document details
// @route   GET /api/documents/:id
export const getDocumentById = async (req, res) => {
    try {
        const log = (msg) => console.log(`[getDocById] ${new Date().toISOString()} ${msg}`);

        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        if (doc.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const docResponse = doc.toObject();
        docResponse.url = `/api/documents/${doc._id}/content`;
        log(`Returning ID: ${doc._id}, Proxy URL: ${docResponse.url}`);

        res.json(docResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Flashcards
// @route   POST /api/documents/:id/flashcards
export const generateFlashcards = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
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
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.json([]);
        }
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
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
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
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
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
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
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
// @desc    Generate Revision Plan
// @route   POST /api/documents/:id/plan
export const generateRevisionPlan = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Document not found (Invalid ID)' });
        }
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        const plan = await aiGenerateRevisionPlan(doc.content, doc.name);
        res.json(plan);
    } catch (error) {
        console.error("Generate Plan Error:", error);
        res.status(500).json({ message: 'AI generation failed: ' + error.message });
    }
};
