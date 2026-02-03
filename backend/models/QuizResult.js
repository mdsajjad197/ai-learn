import mongoose from 'mongoose';

const quizResultSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Document'
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
