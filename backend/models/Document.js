import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    type: { type: String },
    size: { type: String },
    url: { type: String, required: true },
    publicId: { type: String },
    content: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', DocumentSchema);
