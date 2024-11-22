require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const Blog = require("../models/blog.model.js");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
};
module.exports = authenticate;
