import mongoose, { model } from "mongoose";
import experiencesSchema from "./experienceModal.js";
import educationalModel from "./educationModal.js";
import linksModel from "./linksModel.js";

const { Schema } = mongoose;
const resumeSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String },
    photo: { type: String, required: true },
    links: [linksModel],
    experiences: [experiencesSchema],
    educarions: [educationalModel],
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export default model("Resume", resumeSchema);
