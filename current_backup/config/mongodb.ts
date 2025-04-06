import mongoose from 'mongoose';

// Replace hardcoded values with environment variables in production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nadnandagiri:0feFsNc2ACvv4EG3@credintcal.a09qovc.mongodb.net/?retryWrites=true&w=majority&appName=credintcal';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Track the connection status
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return mongoose;
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
    return mongoose;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// For direct usage in API routes
const mongodbConnection = mongoose.connection;

// Initialize connection if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI).catch(err => {
    console.error('Failed to connect to MongoDB on startup:', err);
  });
}

export default mongodbConnection; 