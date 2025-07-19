import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends Document {
  name: string;
  phone?: string;
  email: string;
  password: string;
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
  name: { type: String, required: [true, "Username is required"] },
  phone: { 
    type: String, 
    sparse: true, 
    unique: true,
    set: (v: string) => v === '' ? undefined : v  // This will set empty strings to undefined
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: { type: String, required: [true, "Password is required"] },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
});

UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;