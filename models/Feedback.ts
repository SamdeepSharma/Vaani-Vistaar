import mongoose, { Document, Schema } from 'mongoose';

export interface Feedback extends Document {
  userId: Schema.Types.ObjectId;
  userEmail: string;
  rating: number;
  review?: string;
  fromLanguage: string;
  toLanguage: string;
  originalText: string;
  translatedText: string;
  createdAt: Date;
}

const FeedbackSchema: Schema<Feedback> = new mongoose.Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  userEmail: {
    type: String,
    required: true
  },
  rating: { 
    type: Number, 
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  review: { 
    type: String,
    required: false
  },
  fromLanguage: { 
    type: String, 
    required: [true, "Source language is required"]
  },
  toLanguage: { 
    type: String, 
    required: [true, "Target language is required"]
  },
  originalText: { 
    type: String, 
    required: [true, "Original text is required"]
  },
  translatedText: { 
    type: String, 
    required: [true, "Translated text is required"]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for faster queries
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ rating: 1 });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export default Feedback;