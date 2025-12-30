import Cart from "../models/Cart.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    // 🔥 ALWAYS RETURN A CART
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add item to cart

export const addToCart = async (req, res) => {
  const { productId, quantity = 1, size } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    // 🔥 CREATE CART IF NOT EXISTS
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId &&
      item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update quantity
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json("Cart not found");

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) return res.status(404).json("Item not found");

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item
export const removeFromCart = async (req, res) => {
  const { productId, size } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json("Cart not found");

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeItemSize = async (req, res) => {
  const { productId, oldSize, newSize } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.size === oldSize
    );

    if (!item) return res.status(404).json("Item not found");

    item.size = newSize; // 👕 Change size

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
