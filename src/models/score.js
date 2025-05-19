import mongoose from 'mongoose';

const scoreschema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true }); // ✅ THIS LINE IS IMPORTANT

export default mongoose.models.Score || mongoose.model('Score', scoreschema);
