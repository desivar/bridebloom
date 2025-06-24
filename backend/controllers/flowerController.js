const Flower = require('../models/Flower');

// Get flowers by season with optional filters
const getFlowersBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const { category, minPrice, maxPrice, sortBy } = req.query;
    
    // Validate season
    const validSeasons = ['spring', 'summer', 'fall', 'winter'];
    if (!validSeasons.includes(season)) {
      return res.status(400).json({ message: 'Invalid season specified' });
    }

    // Build query
    const query = { season };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort
    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    else if (sortBy === 'popular') sort.popularity = -1;
    else sort.createdAt = -1; // default: newest first

    const flowers = await Flower.find(query)
      .sort(sort)
      .select('-__v'); // Exclude version key

    res.json({
      season,
      count: flowers.length,
      flowers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all seasons with sample flowers
const getAllSeasonalFlowers = async (req, res) => {
  try {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const seasonalFlowers = {};
    
    // Get 3 featured flowers for each season
    for (const season of seasons) {
      seasonalFlowers[season] = await Flower.find({ season })
        .sort({ popularity: -1 })
        .limit(3)
        .select('name price imageUrl');
    }

    res.json(seasonalFlowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other controller methods (create, update, delete) would remain similar
// but should include season validation when creating/updating flowers

module.exports = {
  getFlowersBySeason,
  getAllSeasonalFlowers,
  // ... other methods
};