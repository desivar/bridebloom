import mongoose from 'mongoose';

const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, enum: ['spring','summer','fall','winter'], required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Flower', flowerSchema);
