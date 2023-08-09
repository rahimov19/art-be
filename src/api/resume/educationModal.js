import mongoose from "mongoose";
const { Schema, model } = mongoose;

const educationalModel = new Schema(
  {
    role: { type: String, required: true },
    uni: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String, required: true },
    area: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default educationalModel;
