import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
const recipeSchema = new Schema(
  {
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "BzUser",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    picture: {},
    ingredients: [String],
    steps: [String],
    raw_steps: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema, "Recipe");
