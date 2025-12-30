import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String,
    category: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true
    },
    stock: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
