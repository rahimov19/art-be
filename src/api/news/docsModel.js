import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const docsSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    language: { type: String, enum: ["ru", "tj", "en"], required: true },
  },
  { timestamps: true }
);

export default model("Docs", docsSchema);
