import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route POST api/auth/register
// @desc user registration
// @access public

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Credentials Missing!",
      data: null,
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
        data: null,
      });
    }

    const newUser = await User.create({ name, email, password });

    return res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error("User Registration Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      data: null,
    });
  }
};

// @route POST api/auth/login
// @desc user login
// @access public

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
      data: null,
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
        data: null,
      });
    }

    return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      data: null,
    });
  }
};

// @route GET api/auth/user
// @desc user profile
// @access private

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // optional, remove if not needed
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user.",
      data: null,
    });
  }
};

// @route PUT api/auth/updateUser
// @desc update user
// @access private

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields only if provided
    user.name = req.body.name ?? user.name;
    user.businessName = req.body.businessName ?? user.businessName;
    user.address = req.body.address ?? user.address;
    user.phone = req.body.phone ?? user.phone;

    const updatedUser = await user.save();

    res.status(200).json({
        name: updatedUser.name,
        businessName: updatedUser.businessName,
        address: updatedUser.address,
        phone: updatedUser.phone,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};
