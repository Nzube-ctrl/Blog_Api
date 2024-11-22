const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const signUp = async (userData) => {
  const { first_name, last_name, email, password } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });
  await user.save();
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

const signIn = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid Password");
  }
  const token = generateToken(user);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return { user: userWithoutPassword, token };
};

module.exports = {
  signIn,
  signUp,
};
