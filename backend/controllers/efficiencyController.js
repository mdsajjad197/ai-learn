import Document from '../models/Document.js';
import QuizResult from '../models/QuizResult.js';
import { generateRevisionPlan as aiGeneratePlan } from '../services/aiService.js';

// @desc    Get Weak Areas (Low performing documents)
// @route   GET /api/efficiency/weak-areas
export const getWeakAreas = async (req, res) => {
    try {
        // Find documents where latest quiz score is < 70%
        // First get all quiz results for user
        const results = await QuizResult.find({ user: req.user._id }).sort({ createdAt: -1 });

        // Map to get latest result per document
        const latestResults = {};
        results.forEach(r => {
            if (!latestResults[r.docId]) {
                latestResults[r.docId] = r;
            }
        });

        // Filter for weak areas: 3 or more wrong answers
        const weakDocIds = Object.values(latestResults)
            .filter(r => (r.totalQuestions - r.score) >= 3)
            .map(r => r.docId);

        if (weakDocIds.length === 0) {
            return res.json([]);
        }

        const documents = await Document.find({ _id: { $in: weakDocIds } }).select('name type size createdAt');

        // Attach the score to the document object for frontend display
        const documentsWithScores = documents.map(doc => {
            const result = latestResults[doc._id];
            return {
                ...doc.toObject(),
                currentScore: result.percentage,
                wrongAnswers: result.totalQuestions - result.score
            };
        });

        res.json(documentsWithScores);

    } catch (error) {
        console.error("Weak Areas Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Revision Plan
// @route   GET /api/efficiency/revision-plan
export const getRevisionPlan = async (req, res) => {
    try {
        // Get weak areas first
        const results = await QuizResult.find({ user: req.user._id }).sort({ createdAt: -1 });
        const latestResults = {};
        results.forEach(r => {
            if (!latestResults[r.docId]) latestResults[r.docId] = r;
        });

        const weakDocIds = Object.values(latestResults)
            .filter(r => (r.totalQuestions - r.score) >= 3)
            .map(r => r.docId);

        let context = "";
        let topicList = [];

        if (weakDocIds.length > 0) {
            const docs = await Document.find({ _id: { $in: weakDocIds } }).select('name content');
            topicList = docs.map(d => d.name);
            // Limit context to prevent token overflow, just lists of topics
            context = `Student is struggling with these topics (3 or more wrong answers in quizzes): ${topicList.join(', ')}.`;
        } else {
            // General revision if no specific weak areas
            const docs = await Document.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(5);
            if (docs.length === 0) return res.json({ plan: [] });
            topicList = docs.map(d => d.name);
            context = `Student has these topics available: ${topicList.join(', ')}.`;
        }

        const plan = await aiGeneratePlan(context, "Efficiency Report: " + topicList.join(', '));
        res.json(plan);

    } catch (error) {
        console.error("Revision Plan Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Progress Analytics
// @route   GET /api/efficiency/analytics
export const getProgressAnalytics = async (req, res) => {
    try {
        const results = await QuizResult.find({ user: req.user._id })
            .sort({ createdAt: 1 }) // Oldest to newest for chart
            .populate('docId', 'name');

        const data = results.map(r => ({
            date: r.createdAt.toISOString().split('T')[0],
            score: r.percentage,
            document: r.docId ? r.docId.name : 'Unknown Doc'
        }));

        res.json(data);
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
