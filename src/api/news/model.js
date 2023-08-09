import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    language: { type: String, enum: ["ru", "tj", "en"], required: true },
  },
  { timestamps: true }
);

export default model("News", newsSchema);
