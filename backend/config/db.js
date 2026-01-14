import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connection options optimized for production and concurrent users
    const options = {
      maxPoolSize: 10,          // Maximum number of connections in the pool
      minPoolSize: 2,           // Minimum number of connections
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000,   // How long a socket can be inactive
      family: 4,                // Use IPv4, skip IPv6
      retryWrites: true,        // Retry failed writes
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
