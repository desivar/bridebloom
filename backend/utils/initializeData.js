const Flower = require('../models/Flower');

const initializeData = async () => {
  try {
    const flowerCount = await Flower.countDocuments();
    if (flowerCount === 0) {
      const sampleFlowers = [
        {
          name: 'Romantic Rose Bouquet',
          description: 'Classic red roses perfect for any season',
          price: 89.99,
          season: 'all-season',
          color: ['red', 'pink'],
          category: 'bouquet',
          imageUrl: 'https://example.com/rose-bouquet.jpg',
          popularity: 95
        },
        // Add more sample flowers...
      ];
      
      await Flower.insertMany(sampleFlowers);
      console.log('Sample flowers inserted');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

module.exports = initializeData;