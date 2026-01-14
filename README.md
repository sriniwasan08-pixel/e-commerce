# MERN E-Commerce Platform

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js.

## Features

- 🔐 User authentication (JWT)
- 🛍️ Product catalog with categories and search
- 🛒 Shopping cart (persistent for logged-in users)
- 📦 Order management
- 👤 User profiles
- ⚙️ Admin panel (product/order management)
- 🎨 Modern dark-themed UI

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs on http://localhost:5000

### 2. Seed Database (Optional)

```bash
cd backend
node utils/seedData.js
```

This creates sample products and test users:
- Admin: admin@example.com / admin123
- User: john@example.com / user123

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:3000

## Project Structure

```
project/
├── backend/          # Express.js API
│   ├── config/       # Database config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, error handling
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   └── utils/        # Seed data
├── frontend/         # React app
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context (Auth, Cart)
│       └── pages/       # Page components
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| GET | /api/cart | Get user cart |
| POST | /api/orders | Create order |

## Tech Stack

- **Frontend**: React 18, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT, bcrypt
- **Styling**: Vanilla CSS with CSS variables
