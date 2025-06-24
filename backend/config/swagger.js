const swaggerJsdoc = require('swagger-jsdoc');

const options = {
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
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;

/**
 * @swagger
 * /flowers/seasons:
 *   get:
 *     summary: Get featured flowers for all seasons
 *     description: Returns 3 featured flowers for each season (spring, summer, fall, winter)
 *     tags: [Flowers]
 *     responses:
 *       200:
 *         description: Seasonal flowers data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 spring:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *                 summer:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *                 fall:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *                 winter:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 */

/**
 * @swagger
 * /flowers/season/{season}:
 *   get:
 *     summary: Get flowers by season
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: season
 *         required: true
 *         schema:
 *           type: string
 *           enum: [spring, summer, fall, winter]
 *         description: The season to filter by
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [bouquet, centerpiece, ceremony, boutonniere]
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, popular, newest]
 *           default: newest
 *     responses:
 *       200:
 *         description: List of flowers for the specified season
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 season:
 *                   type: string
 *                 count:
 *                   type: number
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 */