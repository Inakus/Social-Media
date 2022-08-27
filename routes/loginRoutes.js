const UserSchema = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Password and email are required" });
  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password should be at least 8 charakter long" });
  }

  const user = await UserSchema.findOne({ email });

  if (user) return res.status(400).json({ msg: "User already exists" });

  const newUser = UserSchema({ email, password });
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err)
      return res.status(400).json({ msg: "error while saving the password" });

    newUser.password = hash;
    const saveUserRes = await newUser.save();

    if (saveUserRes)
      return res.status(200).json({ msg: "user is succesfully saved" });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: "Something missing" });
  }

  const user = await UserSchema.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (matchPassword) {
    const userSession = { email: user.email };

    req.session.user = userSession;

    return res
      .status(200)
      .json({ msg: "You have logged in successfully" }, userSession);
  } else {
    return res.status(400).json({ msg: "Invalid credential" });
  }
});

module.exports = router;
