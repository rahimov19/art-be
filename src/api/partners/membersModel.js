import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const membersSchema = new Schema(
  {
    name: { type: String, required: true },
    legalName: { type: String },
    image: { type: String },
    description: { type: String, required: true },
    taxNumber: { type: String },
    address: { type: String },
    legalAddress: { type: String },
    phone: { type: Number },
    webPage: { type: String },
    socialPage: { type: String },
    typeOfMember: { type: String },
    nameOfContact: { type: String },
    emailOfContact: { type: String },
    phoneOfContact: { type: String },
    positionOfContact: { type: String },
  },
  { timestamps: true }
);

export default model("member", membersSchema);
