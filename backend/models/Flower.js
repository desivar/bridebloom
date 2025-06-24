const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  season: { 
    type: String, 
    enum: ['spring', 'summer', 'fall', 'winter'], 
    required: true,
    index: true
  },
  colors: [{
    type: String,
    trim: true
  }],
  category: { 
    type: String, 
    enum: ['bouquet', 'centerpiece', 'ceremony', 'boutonniere'], 
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  popularity: { 
    type: Number, 
    default: 0,
    min: 0
  },
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better performance on season-based queries
FlowerSchema.index({ season: 1, category: 1 });

module.exports = mongoose.model('Flower', FlowerSchema);