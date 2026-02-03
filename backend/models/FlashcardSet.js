import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
    front: { type: String, required: true },
    back: { type: String, required: true }
});

const FlashcardSetSchema = new mongoose.Schema({
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    docName: { type: String },
    topic: { type: String },
    cards: [CardSchema],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FlashcardSet', FlashcardSetSchema);
