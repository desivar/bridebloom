// server.js (your backend file)
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
  image: String, // Add this for compatibility
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

// Add Cart and Consultation schemas
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    flowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flower', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }
  }],
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ConsultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  weddingDate: { type: Date, required: true },
  message: String,
  preferredDate: Date,
  status: { 
    type: String, 
    enum: ['pending', 'scheduled', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Flower = mongoose.model('Flower', FlowerSchema);
const Order = mongoose.model('Order', OrderSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Consultation = mongoose.model('Consultation', ConsultationSchema);

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
 * /api/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 */
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// ========== FLOWER ENDPOINTS ==========

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
 * /api/flowers/{id}:
 *   get:
 *     summary: Get a single flower by ID
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flower details
 *       404:
 *         description: Flower not found
 */
app.get('/api/flowers/:id', async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);
    if (!flower) {
      return res.status(404).json({ message: 'Flower not found' });
    }
    res.json(flower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/flowers/popular:
 *   get:
 *     summary: Get popular flowers
 *     tags: [Flowers]
 *     responses:
 *       200:
 *         description: List of popular flowers
 */
app.get('/api/flowers/popular', async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ popularity: -1 }).limit(10);
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

// ========== CART ENDPOINTS ==========

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart items
 */
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId }).populate('items.flowerId');
    
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flowerId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart
 */
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { flowerId, quantity = 1 } = req.body;
    
    // Get flower details
    const flower = await Flower.findById(flowerId);
    if (!flower) {
      return res.status(404).json({ message: 'Flower not found' });
    }
    
    let cart = await Cart.findOne({ userId: req.user.userId });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.flowerId.toString() === flowerId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        flowerId,
        quantity,
        price: flower.price,
        name: flower.name,
        image: flower.image || flower.imageUrl
      });
    }
    
    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
app.delete('/api/cart/:itemId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== CONSULTATION ENDPOINTS ==========

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Schedule a consultation
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               weddingDate:
 *                 type: string
 *                 format: date
 *               message:
 *                 type: string
 *               preferredDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Consultation scheduled successfully
 */
app.post('/api/consultations', async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Get all consultations (admin) or user's consultations
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of consultations
 */
app.get('/api/consultations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    let consultations;
    if (user.role === 'admin') {
      consultations = await Consultation.find().populate('userId', 'name email');
    } else {
      consultations = await Consultation.find({ userId: req.user.userId });
    }
    
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== ORDER ENDPOINTS ==========

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
 * /api/orders/history:
 *   get:
 *     summary: Get order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history
 */
app.get('/api/orders/history', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.userId })
      .populate('items.flowerId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== REVIEW ENDPOINTS ==========

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
          image: 'https://img.freepik.com/premium-psd/red-roses-wedding-arrangement_176841-58423.jpg',
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
          image: 'https://th.bing.com/th/id/OIP.-mjdzxOQeE5rVwmeoGynUwAAAA?rs=1&pid=ImgDetMain&cb=idpwebpc2',
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
          image: 'https://i.pinimg.com/736x/10/74/fc/1074fc613d14895c5d2f0714ce64b97d.jpg',
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
// Add this function to server.js (before app.listen)
const initializeFlowerData = async () => {
  try {
    const flowerCount = await Flower.countDocuments();
    if (flowerCount === 0) {
      const sampleFlowers = [
        {
          name: 'Romantic Rose Bouquet',
          description: 'Classic red roses perfect for any season. Hand-tied with baby\'s breath and greenery.',
          price: 89.99,
          season: 'all-season',
          color: ['red', 'pink'],
          category: 'bouquet',
          imageUrl: 'https://img.freepik.com/premium-psd/red-roses-wedding-arrangement_176841-58423.jpg',
          image: 'https://img.freepik.com/premium-psd/red-roses-wedding-arrangement_176841-58423.jpg',
          popularity: 95
        },
        {
          name: 'Spring Tulip Centerpiece',
          description: 'Vibrant tulips for spring celebrations. Perfect for table arrangements.',
          price: 65.99,
          season: 'spring',
          color: ['pink', 'yellow', 'purple'],
          category: 'centerpiece',
          imageUrl: 'https://th.bing.com/th/id/OIP.-mjdzxOQeE5rVwmeoGynUwAAAA?rs=1&pid=ImgDetMain&cb=idpwebpc2',
          image: 'https://th.bing.com/th/id/OIP.-mjdzxOQeE5rVwmeoGynUwAAAA?rs=1&pid=ImgDetMain&cb=idpwebpc2',
          popularity: 85
        },
        {
          name: 'Summer Sunflower Bliss',
          description: 'Bright sunflowers that capture the essence of summer.',
          price: 75.99,
          season: 'summer',
          color: ['yellow', 'orange'],
          category: 'bouquet',
          imageUrl: 'https://cdn11.bigcommerce.com/s-0023c/images/stencil/1280w/products/2483/7882/IMG20230718114054_002__20230.1689645075.jpg?c=2',
          image: 'https://cdn11.bigcommerce.com/s-0023c/images/stencil/1280w/products/2483/7882/IMG20230718114054_002__20230.1689645075.jpg?c=2',
          popularity: 88
        },
        {
          name: 'Autumn Elegance Bouquet',
          description: 'Warm tones of fall with dahlias, chrysanthemums, and berries.',
          price: 82.99,
          season: 'fall',
          color: ['orange', 'red', 'burgundy'],
          category: 'bouquet',
          imageUrl: 'https://s-media-cache-ak0.pinimg.com/736x/ac/0c/18/ac0c1831e5627b38773ca68d8c995593.jpg',
          image: 'https://s-media-cache-ak0.pinimg.com/736x/ac/0c/18/ac0c1831e5627b38773ca68d8c995593.jpg',
          popularity: 90
        },
        {
          name: 'Winter White Wonder',
          description: 'Elegant white flowers for a winter wonderland wedding.',
          price: 99.99,
          season: 'winter',
          color: ['white', 'silver'],
          category: 'bouquet',
          imageUrl: 'https://www.thebridalflower.com/wp-content/uploads/2017/09/The-Bridal-Flower-5780-768x768.jpg',
          image: 'https://www.thebridalflower.com/wp-content/uploads/2017/09/The-Bridal-Flower-5780-768x768.jpg',
          popularity: 92
        },
        {
          name: 'Elegant Ceremony Arch',
          description: 'Stunning floral arch for your ceremony backdrop.',
          price: 299.99,
          season: 'all-season',
          color: ['white', 'green'],
          category: 'ceremony',
          imageUrl: 'https://i.pinimg.com/736x/10/74/fc/1074fc613d14895c5d2f0714ce64b97d.jpg',
          image: 'https://i.pinimg.com/736x/10/74/fc/1074fc613d14895c5d2f0714ce64b97d.jpg',
          popularity: 90
        }
      ];
      
      await Flower.insertMany(sampleFlowers);
      console.log('✅ Sample flowers inserted into MongoDB');
    } else {
      console.log(`✅ Database already has ${flowerCount} flowers`);
    }
  } catch (error) {
    console.error('❌ Error initializing flower data:', error);
  }
};

// Call this function in your app.listen or initializeData function
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  
  // Initialize data
  await initializeFlowerData();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  initializeData();
});