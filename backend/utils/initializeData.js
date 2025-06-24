const Flower = require('../models/Flower');

const sampleFlowers = {
  spring: [
    {
      name: 'Cherry Blossom Bouquet',
      description: 'Delicate pink cherry blossoms with seasonal greens',
      price: 89.99,
      season: 'spring',
      colors: ['pink', 'white'],
      category: 'bouquet',
      imageUrl: 'https://i.pinimg.com/originals/3a/bf/ca/3abfcac4c97f8ea9be6ebaff99a696a8.jpg',
      popularity: 95
    },
    // More spring flowers...
  ],
  summer: [
    {
      name: 'Sunflower Splendor',
      description: 'Vibrant sunflowers with summer blooms',
      price: 75.99,
      season: 'summer',
      colors: ['yellow', 'brown'],
      category: 'bouquet',
      imageUrl: 'https://cdn11.bigcommerce.com/s-0023c/images/stencil/1280w/products/2483/7882/IMG20230718114054_002__20230.1689645075.jpg?c=2',
      popularity: 88
    },
    // More summer flowers...
  ],
  // Add fall and winter similarly
};

const initializeData = async () => {
  try {
    const count = await Flower.countDocuments();
    if (count === 0) {
      // Flatten all seasonal flowers into one array
      const allFlowers = Object.values(sampleFlowers).flat();
      await Flower.insertMany(allFlowers);
      console.log('Sample flowers initialized');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

module.exports = initializeData;