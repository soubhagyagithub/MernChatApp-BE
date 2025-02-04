const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandlers = require("express-async-handler");

const protect = asyncHandlers(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token ID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("User not found in DB:", decoded.id);
        res.status(401);
        throw new Error("User not found");
      }

      console.log("User found:", req.user);
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401);
      throw new Error("Not Authorized, Token Failed!");
    }
  } else {
    console.log("No token provided");
    res.status(401);
    throw new Error("Not Authorized, Token Failed!");
  }
});

module.exports = { protect };
