// server/models/Flower.js

const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    season: {
        type: String,
        required: true,
        enum: ['spring', 'summer', 'fall', 'winter'], // Restricts values to these four seasons
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the model using the schema
const Flower = mongoose.model('Flower', flowerSchema);

module.exports = Flower;