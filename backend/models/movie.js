import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: [String],
  description: String,
  streamingUrl: String,
});

export default model("Movie", movieSchema);
