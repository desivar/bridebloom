const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/brideblooms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bride Blooms API',
      version: '1.0.0',
      description: 'API for a bridal flower shop with 4-season flower delivery',
    },
    servers: [
      {
        url: 'http://localhost:5500',
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: String,
  address: String,
  weddingDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const FlowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  season: { type: String, enum: ['spring', 'summer', 'fall', 'winter', 'all-season'], required: true },
  color: [String],
  category: { type: String, enum: ['bouquet', 'centerpiece', 'ceremony', 'boutonniere'], required: true },
  imageUrl: String,
  inStock: { type: Boolean, default: true },
  popularity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    flowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flower', required: true },
    quantity: { type: Number, required: true },
    customizations: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'], default: 'pending' },
  deliveryDate: { type: Date, required: true },
  deliveryAddress: { type: String, required: true },
  specialInstructions: String,
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Flower = mongoose.model('Flower', FlowerSchema);
const Order = mongoose.model('Order', OrderSchema);
const Review = mongoose.model('Review', ReviewSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *           type: string
 *         weddingDate:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, weddingDate } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      weddingDate
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/flowers:
 *   get:
 *     summary: Get all flowers
 *     tags: [Flowers]
 *     parameters:
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: Filter by season
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of flowers
 */
app.get('/api/flowers', async (req, res) => {
  try {
    const { season, category } = req.query;
    let filter = {};
    
    if (season) filter.season = season;
    if (category) filter.category = category;
    
    const flowers = await Flower.find(filter);
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/flowers:
 *   post:
 *     summary: Create a new flower
 *     tags: [Flowers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               season:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Flower created successfully
 */
app.post('/api/flowers', authenticateToken, async (req, res) => {
  try {
    const flower = new Flower(req.body);
    await flower.save();
    res.status(201).json(flower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 */
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const order = new Order({
      customerId: req.user.userId,
      ...req.body
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.userId })
      .populate('items.flowerId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Review created successfully
 */
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const review = new Review({
      customerId: req.user.userId,
      ...req.body
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize sample data
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
          imageUrl: 'https://img.freepik.com/premium-psd/red-roses-wedding-arrangement_176841-58423.jpg',
          popularity: 95
        },
        {
          name: 'Spring Tulip Centerpiece',
          description: 'Vibrant tulips for spring celebrations',
          price: 65.99,
          season: 'spring',
          color: ['pink', 'yellow', 'purple'],
          category: 'centerpiece',
          imageUrl: 'https://th.bing.com/th/id/OIP.-mjdzxOQeE5rVwmeoGynUwAAAA?rs=1&pid=ImgDetMain&cb=idpwebpc2',
          popularity: 85
        },
        {
          name: 'Elegant White Ceremony Arch',
          description: 'Stunning white flowers for ceremony decoration',
          price: 299.99,
          season: 'all-season',
          color: ['white'],
          category: 'ceremony',
          imageUrl: 'https://i.pinimg.com/736x/10/74/fc/1074fc613d14895c5d2f0714ce64b97d.jpg',
          popularity: 90
        }
      ];
      
      await Flower.insertMany(sampleFlowers);
      console.log('Sample flowers inserted');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  initializeData();
});