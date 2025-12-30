// models/Wishlist.js

import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: true }
);


const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;

