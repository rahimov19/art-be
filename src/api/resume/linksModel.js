import mongoose from "mongoose";
const { Schema, model } = mongoose;

const linksModel = new Schema(
  {
    nameOfWebpage: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default linksModel;
