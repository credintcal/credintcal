import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log(`Initializing MongoDB connection to: ${MONGODB_URI.split('@')[1]}`);

const options = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000, // Increased timeout
  socketTimeoutMS: 45000,
};

// Add event handlers to debug connection issues
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// Handle Node.js exit events
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

let connection: typeof mongoose.connection;

if (mongoose.connection.readyState >= 1) {
  console.log('Using existing MongoDB connection');
  connection = mongoose.connection;
} else {
  console.log('Establishing new MongoDB connection');
  try {
    mongoose.connect(MONGODB_URI, options);
    connection = mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export default connection;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  
  console.log('Connecting to MongoDB on demand');
  return mongoose.connect(MONGODB_URI, options);
}; 