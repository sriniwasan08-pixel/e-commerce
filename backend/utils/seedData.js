import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const sampleProducts = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life, comfortable over-ear design, and crystal-clear audio quality. Perfect for music lovers and professionals.',
        price: 149.99,
        originalPrice: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electronics',
        stock: 50,
        rating: 4.5,
        numReviews: 128,
        featured: true,
        brand: 'AudioMax'
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring, GPS tracking, water resistance, and a stunning AMOLED display. Stay connected and track your fitness goals.',
        price: 299.99,
        originalPrice: 349.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: 'Electronics',
        stock: 35,
        rating: 4.7,
        numReviews: 89,
        featured: true,
        brand: 'TechWear'
    },
    {
        name: 'Premium Leather Jacket',
        description: 'Genuine leather motorcycle jacket with quilted lining, multiple pockets, and timeless design. A wardrobe essential for the modern gentleman.',
        price: 249.99,
        originalPrice: 299.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        category: 'Clothing',
        stock: 20,
        rating: 4.8,
        numReviews: 56,
        featured: true,
        brand: 'UrbanStyle'
    },
    {
        name: 'Running Shoes Elite',
        description: 'Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and superior traction. Designed for serious runners.',
        price: 129.99,
        originalPrice: 159.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: 'Sports',
        stock: 45,
        rating: 4.6,
        numReviews: 234,
        featured: true,
        brand: 'SprintMax'
    },
    {
        name: 'Organic Skincare Set',
        description: 'Complete skincare routine with natural ingredients. Includes cleanser, toner, serum, and moisturizer. Suitable for all skin types.',
        price: 89.99,
        originalPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        category: 'Beauty',
        stock: 60,
        rating: 4.4,
        numReviews: 167,
        featured: true,
        brand: 'NaturalGlow'
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with Cherry MX switches, programmable macros, and aircraft-grade aluminum frame. Level up your gaming setup.',
        price: 159.99,
        originalPrice: 189.99,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
        category: 'Electronics',
        stock: 40,
        rating: 4.9,
        numReviews: 312,
        featured: true,
        brand: 'GameTech'
    },
    {
        name: 'Vintage Denim Jacket',
        description: 'Classic denim jacket with distressed wash, brass buttons, and comfortable fit. A timeless piece that never goes out of style.',
        price: 79.99,
        originalPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
        category: 'Clothing',
        stock: 30,
        rating: 4.3,
        numReviews: 78,
        featured: false,
        brand: 'DenimCo'
    },
    {
        name: 'Yoga Mat Premium',
        description: 'Extra-thick eco-friendly yoga mat with non-slip surface, alignment guides, and carrying strap. Perfect for yoga, pilates, and meditation.',
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        category: 'Sports',
        stock: 80,
        rating: 4.5,
        numReviews: 145,
        featured: false,
        brand: 'ZenFit'
    },
    {
        name: 'Bestselling Novel Collection',
        description: 'Curated collection of 5 bestselling fiction novels from acclaimed authors. Perfect gift for book lovers and avid readers.',
        price: 59.99,
        originalPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        category: 'Books',
        stock: 100,
        rating: 4.7,
        numReviews: 203,
        featured: false,
        brand: 'BookHaven'
    },
    {
        name: 'Smart Home Speaker',
        description: 'Voice-controlled smart speaker with premium sound, smart home integration, and AI assistant. Control your home with just your voice.',
        price: 99.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500',
        category: 'Electronics',
        stock: 55,
        rating: 4.4,
        numReviews: 189,
        featured: true,
        brand: 'SmartLife'
    },
    {
        name: 'Designer Sunglasses',
        description: 'Polarized UV-protection sunglasses with titanium frame and scratch-resistant lenses. Elegant design meets ultimate eye protection.',
        price: 189.99,
        originalPrice: 249.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        category: 'Other',
        stock: 25,
        rating: 4.6,
        numReviews: 67,
        featured: false,
        brand: 'VisionElite'
    },
    {
        name: 'Electric Coffee Maker',
        description: 'Programmable coffee maker with built-in grinder, thermal carafe, and customizable brew strength. Start your day with the perfect cup.',
        price: 129.99,
        originalPrice: 169.99,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
        category: 'Home & Garden',
        stock: 40,
        rating: 4.5,
        numReviews: 156,
        featured: false,
        brand: 'BrewMaster'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true
        });
        console.log('Created admin user: admin@example.com / admin123');

        // Create regular user
        const regularUser = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            isAdmin: false
        });
        console.log('Created regular user: john@example.com / user123');

        // Insert products
        await Product.insertMany(sampleProducts);
        console.log(`Inserted ${sampleProducts.length} sample products`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
