// src/lib/dbConnect.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);
  
  // Update the index
  const db:any = mongoose.connection.db;
  if (db) {
    try {
      await db.collection('users').dropIndex('mobile_1');
    } catch (error) {
      console.log('mobile_1 index not found, skipping drop');
    }
  } else {
    console.log('Database connection not established');
  }
  try {
    await db.collection('users').dropIndex('phone_1');
  } catch (error) {
    console.log('phone_1 index not found, skipping drop');
  }
  
  // Recreate the correct index
  if (db) {
    await db.collection('users').createIndex({ phone: 1 }, { unique: true, sparse: true });
  } else {
    console.log('Database connection not established');
  }

  console.log('Database connected successfully and indexes updated');
}

export default dbConnect;