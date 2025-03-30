import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

const options = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let connection: typeof mongoose.connection;

if (mongoose.connection.readyState >= 1) {
  console.log('MongoDB is already connected');
  connection = mongoose.connection;
} else {
  mongoose
    .connect(MONGODB_URI, options)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
  
  connection = mongoose.connection;
}

export default connection; 