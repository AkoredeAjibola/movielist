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
	
	

		preferences: [String],
		watchHistory: [String],
		streaks: { type: Number, default: 0 },
		lastWatchedDate: { type: Date },
		watchlist: [
			{
			  id: { type: String, required: true }, // Movie ID
			  title: { type: String, required: true },
			  poster_path: { type: String },
			  watched: { type: Boolean, default: false }, // Track if the movie is watched
			}
		  ],
});

export const User = mongoose.model("User", userSchema);
