import User from '../models/User.js';
import Document from '../models/Document.js';
import FlashcardSet from '../models/FlashcardSet.js';

// @desc    Get all users with stats
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort('-createdAt');

        // Fetch all documents to count per user
        const documents = await Document.find({}).select('owner');

        // Fetch all flashcard sets to count cards per user (via document owner)
        // We populate docId to get the owner of the document the set belongs to
        const flashcardSets = await FlashcardSet.find({}).populate({
            path: 'docId',
            select: 'owner'
        });

        // Compute stats map
        const userStats = {};

        // Initialize
        users.forEach(u => {
            userStats[u._id] = { docCount: 0, cardCount: 0 };
        });

        // Count Documents
        documents.forEach(doc => {
            if (doc.owner && userStats[doc.owner]) {
                userStats[doc.owner].docCount++;
            }
        });

        // Count Flashcards
        flashcardSets.forEach(set => {
            // Check if document and owner exist (docId might be null if doc deleted, though cascading delete should handle it)
            if (set.docId && set.docId.owner && userStats[set.docId.owner]) {
                userStats[set.docId.owner].cardCount += set.cards.length;
            }
        });

        // Merge stats into user objects
        const usersWithStats = users.map(user => {
            const stats = userStats[user._id] || { docCount: 0, cardCount: 0 };
            return {
                ...user.toObject(),
                documentCount: stats.docCount,
                flashcardCount: stats.cardCount
            };
        });

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            await Document.deleteMany({ owner: req.params.id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
export const getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const docCount = await Document.countDocuments();

        // Calculate actual storage used
        const allDocs = await Document.find({}).select('size');

        let totalBytes = 0;

        allDocs.forEach(doc => {
            if (doc.size) {
                const parts = doc.size.split(' ');
                if (parts.length === 2) {
                    const value = parseFloat(parts[0]);
                    const unit = parts[1].toUpperCase();

                    if (unit === 'KB') totalBytes += value * 1024;
                    else if (unit === 'MB') totalBytes += value * 1024 * 1024;
                    else if (unit === 'GB') totalBytes += value * 1024 * 1024 * 1024;
                    else if (unit === 'BYTES' || unit === 'B') totalBytes += value;
                }
            }
        });

        let storageUsed = '0 KB';
        if (totalBytes > 1024 * 1024 * 1024) {
            storageUsed = (totalBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        } else if (totalBytes > 1024 * 1024) {
            storageUsed = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            storageUsed = (totalBytes / 1024).toFixed(2) + ' KB';
        }

        res.json({
            users: userCount,
            documents: docCount,
            storage: storageUsed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all documents (Admin)
// @route   GET /api/admin/documents
export const getAllDocuments = async (req, res) => {
    try {
        const docs = await Document.find({})
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete document (Admin)
// @route   DELETE /api/admin/documents/:id
export const deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (doc) {
            await doc.deleteOne();
            res.json({ message: 'Document removed' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
