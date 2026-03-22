const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/token');
const { sendVerificationEmail } = require('../services/email.service');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.json({ msg: "User exists" });

    const token = generateToken();

    const user = await User.create({
      username,
      email,
      password,
      verificationToken: token
    });

    await sendVerificationEmail(email, token);

    res.json({ msg: "Registered. Check email", isVerified: user.isVerified });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token
  });

  if (!user) return res.json({ msg: "Invalid token" });

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.send("Email verified ✅");
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: "User not found" });

  if (!user.isVerified)
    return res.json({ msg: "Verify email first ❌" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ msg: "Login success ✅", token });
};