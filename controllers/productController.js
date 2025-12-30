import Product from "../models/product.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {

    const query = {};

    if (req.query.isTrending === "true") {
      
      query.isTrending = true;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const sort = req.query.sort || "-createdAt";

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit);

    res.json(products);
  } catch (error) {
    next(error);
  }
};




export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
