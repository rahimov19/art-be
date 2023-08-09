import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    language: { type: String, enum: ["ru", "tj", "en"], required: true },
  },
  { timestamps: true }
);

export default model("banner", bannerSchema);
