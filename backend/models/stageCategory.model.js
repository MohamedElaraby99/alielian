import { Schema, model } from "mongoose";

const stageCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxLength: [100, "Category name should be less than 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxLength: [300, "Description should be less than 300 characters"],
      trim: true,
    },
    stages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Stage",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

stageCategorySchema.index({ name: "text", description: "text" });

export default model("StageCategory", stageCategorySchema);


