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
      contact: {
        name: "API Support",
        email: "support@brideblooms.com"
      }
    },
    servers: [
      {
        url: 'http://localhost:5500',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./server.js'], // Point to this file for JSDoc comments
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
    customizations: String,
    priceAtPurchase: { type: Number, required: true }
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
  flowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flower', required: true },
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

// Middleware for admin check
const isAdmin = (req, res, next) => {
  User.findById(req.user.userId)
    .then(user => {
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Flowers
 *     description: Flower management endpoints
 *   - name: Orders
 *     description: Order management endpoints
 *   - name: Reviews
 *     description: Review management endpoints
 *   - name: Users
 *     description: User management endpoints
 */

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
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [customer, admin]
 *           default: customer
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         weddingDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: d5fE_asz
 *         name: Jane Doe
 *         email: jane@example.com
 *         role: customer
 *         phone: "+1234567890"
 *         address: "123 Main St, Anytown"
 *         weddingDate: "2023-06-15"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 * 
 *     Flower:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - season
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the flower
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         season:
 *           type: string
 *           enum: [spring, summer, fall, winter, all-season]
 *         color:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *           enum: [bouquet, centerpiece, ceremony, boutonniere]
 *         imageUrl:
 *           type: string
 *         inStock:
 *           type: boolean
 *         popularity:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: d5fE_asz
 *         name: Romantic Rose Bouquet
 *         description: Classic red roses perfect for any season
 *         price: 89.99
 *         season: all-season
 *         color: ["red", "pink"]
 *         category: bouquet
 *         imageUrl: "https://example.com/rose-bouquet.jpg"
 *         inStock: true
 *         popularity: 95
 *         createdAt: "2023-01-01T00:00:00.000Z"
 * 
 *     Order:
 *       type: object
 *       required:
 *         - customerId
 *         - items
 *         - totalAmount
 *         - deliveryDate
 *         - deliveryAddress
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         customerId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               flowerId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               customizations:
 *                 type: string
 *               priceAtPurchase:
 *                 type: number
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, delivered, cancelled]
 *           default: pending
 *         deliveryDate:
 *           type: string
 *           format: date
 *         deliveryAddress:
 *           type: string
 *         specialInstructions:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: d5fE_asz
 *         customerId: d5fE_asz
 *         items: [{flowerId: d5fE_asz, quantity: 1, customizations: "Add ribbon", priceAtPurchase: 89.99}]
 *         totalAmount: 89.99
 *         status: pending
 *         deliveryDate: "2023-06-15"
 *         deliveryAddress: "123 Main St, Anytown"
 *         specialInstructions: "Leave at front door"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 * 
 *     Review:
 *       type: object
 *       required:
 *         - customerId
 *         - flowerId
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the review
 *         customerId:
 *           type: string
 *         flowerId:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: d5fE_asz
 *         customerId: d5fE_asz
 *         flowerId: d5fE_asz
 *         rating: 5
 *         comment: "Beautiful flowers!"
 *         images: ["https://example.com/review1.jpg"]
 *         createdAt: "2023-01-01T00:00:00.000Z"
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// AUTHENTICATION ROUTES

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
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               weddingDate:
 *                 type: string
 *                 format: date
 *             example:
 *               name: Jane Doe
 *               email: jane@example.com
 *               password: password123
 *               phone: "+1234567890"
 *               address: "123 Main St, Anytown"
 *               weddingDate: "2023-06-15"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, weddingDate } = req.body;
    
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
      address,
      weddingDate
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        weddingDate: user.weddingDate
      } 
    });
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
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: jane@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        weddingDate: user.weddingDate
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FLOWER ROUTES

/**
 * @swagger
 * /api/flowers:
 *   get:
 *     summary: Get all flowers with optional filtering
 *     tags: [Flowers]
 *     parameters:
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *           enum: [spring, summer, fall, winter, all-season]
 *         description: Filter by season
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [bouquet, centerpiece, ceremony, boutonniere]
 *         description: Filter by category
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by color
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for flower names
 *     responses:
 *       200:
 *         description: List of flowers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flower'
 *       500:
 *         description: Server error
 */
app.get('/api/flowers', async (req, res) => {
  try {
    const { season, category, color, minPrice, maxPrice, search } = req.query;
    let filter = {};
    
    if (season) filter.season = season;
    if (category) filter.category = category;
    if (color) filter.color = color;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const flowers = await Flower.find(filter).sort({ popularity: -1 });
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
 *         schema:
 *           type: string
 *         required: true
 *         description: Flower ID
 *     responses:
 *       200:
 *         description: Flower details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flower'
 *       404:
 *         description: Flower not found
 *       500:
 *         description: Server error
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
 * /api/flowers:
 *   post:
 *     summary: Create a new flower (Admin only)
 *     tags: [Flowers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flower'
 *     responses:
 *       201:
 *         description: Flower created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flower'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
app.post('/api/flowers', authenticateToken, isAdmin, async (req, res) => {
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
 * /api/flowers/{id}:
 *   put:
 *     summary: Update a flower (Admin only)
 *     tags: [Flowers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Flower ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flower'
 *     responses:
 *       200:
 *         description: Flower updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flower'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Flower not found
 *       500:
 *         description: Server error
 */
app.put('/api/flowers/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const flower = await Flower.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
 * /api/flowers/{id}:
 *   delete:
 *     summary: Delete a flower (Admin only)
 *     tags: [Flowers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Flower ID
 *     responses:
 *       200:
 *         description: Flower deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Flower not found
 *       500:
 *         description: Server error
 */
app.delete('/api/flowers/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const flower = await Flower.findByIdAndDelete(req.params.id);
    if (!flower) {
      return res.status(404).json({ message: 'Flower not found' });
    }
    res.json({ message: 'Flower deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ORDER ROUTES

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - deliveryDate
 *               - deliveryAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - flowerId
 *                     - quantity
 *                   properties:
 *                     flowerId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     customizations:
 *                       type: string
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *               deliveryAddress:
 *                 type: string
 *               specialInstructions:
 *                 type: string
 *             example:
 *               items:
 *                 - flowerId: "507f1f77bcf86cd799439011"
 *                   quantity: 2
 *                   customizations: "Add ribbon"
 *               deliveryDate: "2023-06-15"
 *               deliveryAddress: "123 Main St, Anytown"
 *               specialInstructions: "Leave at front door"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    // Validate items
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Get flower details and calculate total
    let totalAmount = 0;
    const itemsWithPrices = [];
    
    for (const item of req.body.items) {
      const flower = await Flower.findById(item.flowerId);
      if (!flower) {
        return res.status(400).json({ message: `Flower with ID ${item.flowerId} not found` });
      }
      if (!flower.inStock) {
        return res.status(400).json({ message: `Flower ${flower.name} is out of stock` });
      }
      
      const itemTotal = flower.price * item.quantity;
      totalAmount += itemTotal;
      
      itemsWithPrices.push({
        flowerId: item.flowerId,
        quantity: item.quantity,
        customizations: item.customizations || '',
        priceAtPurchase: flower.price
      });
    }

    const order = new Order({
      customerId: req.user.userId,
      items: itemsWithPrices,
      totalAmount,
      deliveryDate: req.body.deliveryDate,
      deliveryAddress: req.body.deliveryAddress,
      specialInstructions: req.body.specialInstructions || ''
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
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * /api/orders/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
app.get('/api/orders/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('items.flowerId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to view this order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.flowerId')
      .populate('customerId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.customerId._id.toString() !== req.user.userId && 
        !(await User.findById(req.user.userId)).role === 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, delivered, cancelled]
 *             example:
 *               status: confirmed
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
app.patch('/api/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.flowerId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REVIEW ROUTES

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flowerId
 *               - rating
 *             properties:
 *               flowerId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               flowerId: "507f1f77bcf86cd799439011"
 *               rating: 5
 *               comment: "Beautiful flowers!"
 *               images: ["https://example.com/review1.jpg"]
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid review data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    // Check if user has ordered this flower
    const hasOrdered = await Order.exists({
      customerId: req.user.userId,
      'items.flowerId': req.body.flowerId,
      status: 'delivered'
    });
    
    if (!hasOrdered) {
      return res.status(400).json({ message: 'You can only review flowers you have ordered and received' });
    }

    // Check if user already reviewed this flower
    const existingReview = await Review.findOne({
      customerId: req.user.userId,
      flowerId: req.body.flowerId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this flower' });
    }

    const review = new Review({
      customerId: req.user.userId,
      flowerId: req.body.flowerId,
      rating: req.body.rating,
      comment: req.body.comment || '',
      images: req.body.images || []
    });

    await review.save();
    
    // Update flower's average rating
    await updateFlowerRating(req.body.flowerId);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/flower/{flowerId}:
 *   get:
 *     summary: Get reviews for a specific flower
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: flowerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Flower ID
 *     responses:
 *       200:
 *         description: List of reviews for the flower
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
app.get('/api/reviews/flower/:flowerId', async (req, res) => {
  try {
    const reviews = await Review.find({ flowerId: req.params.flowerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/user:
 *   get:
 *     summary: Get current user's reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get('/api/reviews/user', authenticateToken, async (req,