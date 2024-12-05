import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	
	

	preferences: {
		type: [String],
		default: [],
	  },
	  watchHistory: [
		{
		  movieId: { type: String, required: true },
		  movieTitle: { type: String, required: true },
		  watched: { type: Boolean, default: false },
		  watchedAt: { type: Date, default: Date.now },
		},
	  ],
		streaks: { type: Number, default: 0 },
		lastWatchedDate: { type: Date },
		watchlist: [
			{
			  id: { type: String, required: true }, // Movie ID
			  title: { type: String, required: true },
			  poster_path: { type: String },
			  watched: { type: Boolean, default: false }, // Track if the movie is watched
			},
		  ],
},
{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
