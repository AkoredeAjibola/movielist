import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    reminderDate: { type: Date, required: true }, // Store as Date
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Reminder = mongoose.model('Reminder', reminderSchema);
