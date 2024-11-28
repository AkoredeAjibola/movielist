import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
