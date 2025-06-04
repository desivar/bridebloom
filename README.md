# Bride Blooms - Wedding Flower Shop

A full-stack web application for a bridal flower shop featuring a 4-season guarantee, beautiful React frontend, Node.js/Express backend, MongoDB database, and comprehensive API documentation.

## Features

- 🌸 **4-Season Guarantee**: Fresh flowers guaranteed regardless of weather conditions
- 💐 **Beautiful Landing Page**: Responsive design with seasonal flower displays
- 🔐 **Authentication System**: User registration, login, and protected routes
- 🛒 **Shopping Cart**: Add/remove flowers, manage quantities
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 📊 **Admin Dashboard**: Manage flowers, orders, and reviews
- 📝 **API Documentation**: Complete Swagger documentation
- 🌟 **Review System**: Customer reviews and ratings

## Tech Stack

### Frontend

- React 18
- Tailwind CSS
- React Router Dom
- Axios for API calls
- Lucide React for icons
- Framer Motion for animations

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Swagger for API documentation
- CORS enabled

### Database Collections

1. **Users** - Customer and admin accounts
2. **Flowers** - Flower inventory with seasonal categorization
3. **Orders** - Customer orders and delivery information
4. **Reviews** - Customer reviews and ratings

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend directory**
```bash
mkdir bride-blooms-backend
cd bride-blooms-backend
```

1. **Initialize and install dependencies**
        ```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors swagger-ui-express swagger-jsdoc dotenv helmet express-rate-limit multer cloudinary
npm install -D nodemon jest supertest
              ```

2. **Create environment file (.env)**
