const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  season: { 
    type: String, 
    enum: ['spring', 'summer', 'fall', 'winter', 'all-season'], 
    required: true 
  },
  color: [String],
  category: { 
    type: String, 
    enum: ['bouquet', 'centerpiece', 'ceremony', 'boutonniere'], 
    required: true 
  },
  imageUrl: String,
  inStock: { type: Boolean, default: true },
  popularity: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flower', FlowerSchema);