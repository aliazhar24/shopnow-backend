import Address from "../models/address.js";

// 📌 Get all addresses of logged-in user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Add new address
export const addAddress = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const address = await Address.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Edit address (update)
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // ensure address belongs to user
      req.body,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
