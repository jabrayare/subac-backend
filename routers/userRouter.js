const express = require("express");
const User = require("../Model/UserModal");
const verifyRoles = require("../middlewares/verifyRolesmiddleware");
const authenticate = require("../middlewares/authMiddleware");
const ROLES_LIST = require("../controllers/roles_list");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const CRYPTO_SECRET = process.env.CRYPTO_SECRET;
const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.get("/", (req, res) => {
  res.status(201).send({ message: "API v.01" });
});

// Login and generate JWT token
userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || password != user.password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Options for the token
    const options = {
      expiresIn: "30s", // Token expiration time -> 30 seconds
    };
    const roles = user.roles
      .map((role) => Object.values(role))
      .map((val) => val[0]);

    const token = jwt.sign(
      {
        userInfo: {
          username: user.username,
          roles: roles,
        },
      },
      CRYPTO_SECRET,
      options
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

userRouter.delete("/user/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(201)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(400).json({ message: "Error deleting user", error: err });
  }
});

userRouter.put("/user/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      res.status(401).json({ message: "User not found." });
    }
    res
      .status(201)
      .json({ message: "User updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Error updating user", error: err });
  }
});

userRouter.get("/user/:id", authenticate, async (req, res) => {
  try {
    userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: "Error finding user", error: err });
  }
});

userRouter.get("/user", authenticate, verifyRoles(ROLES_LIST.admin),
  async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ message: "Error retrieving users", error: err });
    }
  }
);

// Create user
userRouter.post("/user", async (req, res) => {
  console.log(req.body);
  try {
    console.log("Req.body:: ", req.body);
    const { firstName, lastName, username, roles, email, password } = req.body;

    const newUser = await User({
      firstName,
      lastName,
      username,
      roles,
      email,
      password,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
});

module.exports = userRouter;
