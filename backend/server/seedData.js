// backend/seedData.js

const mongoose = require('mongoose');
// Assuming your Flower model is at backend/models/Flower.js
const Flower = require('./models/Flower'); 

// ==========================================================
// 🚨 IMPORTANT: Replace this placeholder with your actual MongoDB connection string
// Example: 'mongodb+srv://user:password@clustername.mongodb.net/brideblooms_db?retryWrites=true&w=majority'
const MONGO_URI = 'mongodb+srv://jilliandesire:bueno4m25?<@cluster0.0xhod.mongodb.net/?appName=Cluster0'; 
// ==========================================================

// --- 🌸 FLOWER DATA TO BE SEEDED 🌸 ---
const newSampleFlowers = [
    // --- SPRING FLOWERS (season: 'spring') ---
    {
        name: 'Cherry Blossom Bouquet',
        price: 89.00,
        season: 'spring',
        category: 'bouquet', 
        description: 'Delicate pink and white blossoms, symbolizing new beginnings.',
        imageUrl: 'https://i.pinimg.com/originals/3a/bf/ca/3abfcac4c97f8ea9be6ebaff99a696a8.jpg',
    },
    {
        name: 'Tulip Paradise',
        price: 65.00,
        season: 'spring',
        category: 'centerpiece',
        description: 'Vibrant tulips creating a lush, cheerful centerpiece.',
        imageUrl: 'https://th.bing.com/th/id/R.f4f5a894e331e2b0b1306df7f5d09cce?rik=xNn50e%2f1mu6URg&riu=http%3a%2f%2fwww.himisspuff.com%2fwp-content%2fuploads%2f2017%2f01%2fWhite-tulip-wedding-bouquets.jpg&ehk=fZQt8xwgN3UJEL5O%2ftsY9nlZqFtB72d9vGHY%2f0G1HA%3d&risl=&pid=ImgRaw&r=0',
    },
    {
        name: 'Daffodil Dreams',
        price: 55.00,
        season: 'spring',
        category: 'boutonniere',
        description: 'Sunny yellow daffodils for a simple, joyous accessory.',
        imageUrl: 'https://www.katherinesflorists.co.uk/wp-content/uploads/2020/03/daffodils-900x1200.jpg',
    },

    // --- SUMMER FLOWERS (season: 'summer') ---
    {
        name: 'Sunflower Splendor',
        price: 75.00,
        season: 'summer',
        category: 'bouquet',
        description: 'Bold, happy sunflowers perfect for an outdoor summer wedding.',
        imageUrl: 'https://cdn11.bigcommerce.com/s-0023c/images/stencil/1280w/products/2483/7882/IMG20230718114054_002__20230.1689645075.jpg?c=2',
    },
    {
        name: 'Peony Perfection',
        price: 95.00,
        season: 'summer',
        category: 'bouquet',
        description: 'Voluminous and fragrant peonies in classic wedding colors.',
        imageUrl: 'https://th.bing.com/th/id/R.8b8e78c05ffc5d277a86eb41253d6f00?rik=C38d9T6ag9etKg&riu=http%3a%2f%2fassets.marthastewartweddings.com%2fstyles%2fwmax-520-highdpi%2fd44%2fmemree-rich-wedding-bouquet-234-6257086-0217%2fmemree-rich-wedding-bouquet-234-6257086-0217_vert.jpg%3fitok%3dpE7WLQko&ehk=f2gwG8rz%2bHp2gZztlCSIX9qBQPxsw%2bOQZT97nGvQuKs%3d&risl=&pid=ImgRaw&r=0',
    },
    {
        name: 'Lavender Love',
        price: 70.00,
        season: 'summer',
        category: 'centerpiece',
        description: 'Rustic lavender accents for a subtle scent and beautiful texture.',
        imageUrl: 'https://i5.walmartimages.com/seo/Ludlz-Artificial-Lavender-Plant-Silk-Flowers-Wedding-Decor-Table-Centerpieces-1Pc-Flower-Garden-DIY-Party-Home-Craft_488c866c-6391-4305-ac63-5860e99f349f.c4fdce3aac39fddd73fe164d964e4bff.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF',
    },

    // --- FALL FLOWERS (season: 'fall') ---
    {
        name: 'Autumn Elegance',
        price: 85.00,
        season: 'fall',
        category: 'bouquet',
        description: 'A blend of rich colors, leaves, and berries for a warm feel.',
        imageUrl: 'https://s-media-cache-ak0.pinimg.com/736x/ac/0c/18/ac0c1831e5627b38773ca68d8c995593.jpg',
    },
    {
        name: 'Mum Magnificence',
        price: 60.00,
        season: 'fall',
        category: 'centerpiece',
        description: 'Deep-toned mums creating classic, cozy fall centerpieces.',
        imageUrl: 'https://th.bing.com/th/id/OIP.BfGN0IKQ7EfmOyVyKdZRmwHaLH?rs=1&pid=ImgDetMain&cb=idpwebpc2',
    },
    {
        name: 'Dahlia Delight',
        price: 80.00,
        season: 'fall',
        category: 'bouquet',
        description: 'Striking dahlias in jewel tones perfect for an autumn bride.',
        imageUrl: 'https://i.pinimg.com/originals/bb/62/96/bb629605ff6d55a6df63fe8d89eae66c.jpg',
    },

    // --- WINTER FLOWERS (season: 'winter') ---
    {
        name: 'Winter White Wonder',
        price: 99.00,
        season: 'winter',
        category: 'bouquet',
        description: 'Clean, crisp white arrangements with subtle frosted textures.',
        imageUrl: 'https://www.thebridalflower.com/wp-content/uploads/2017/09/The-Bridal-Flower-5780-768x768.jpg',
    },
    {
        name: 'Evergreen Elegance',
        price: 110.00,
        season: 'winter',
        category: 'ceremony',
        description: 'A grand arch or display featuring lush evergreens and white florals.',
        imageUrl: 'https://www.loveyouwedding.com/wp-content/uploads/2021/03/306-large-round-white-flowers-and-strings-of-green-leaves.jpg',
    },
    {
        name: 'Poinsettia Paradise',
        price: 65.00,
        season: 'winter',
        category: 'centerpiece',
        description: 'Traditional holiday colors for a festive winter wedding.',
        imageUrl: 'https://i.pinimg.com/originals/24/94/70/249470c8ffddf27ea875439e7dd056c2.jpg',
    },
];
// --- END OF FLOWER DATA ---


const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
        return mongoose.connection;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};


const importData = async () => {
    await connectDB(); // Connect to the database
    try {
        // Clear old data first to prevent duplication on re-run
        console.log('Clearing existing Flower data...');
        await Flower.deleteMany();

        // Insert the new flower data
        console.log('Inserting new Flower data...');
        await Flower.insertMany(newSampleFlowers);

        console.log('✅ Data Successfully Imported!');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
};

// Check if the script is being run directly (i.e., not imported)
if (require.main === module) {
    importData();
}

module.exports = { importData };