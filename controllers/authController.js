import User from "../models/users.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/jwt.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // token from frontend

    if (!credential) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    // 👉 Auto-register if user does not exist
    if (!user) {
      user = new User({
        email,
        fullname: name,
        username: email.split("@")[0],
        password: null,
        isGoogleUser: true
      });

      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user);

    return res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, fullname, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      fullname,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not registered" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};
