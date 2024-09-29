const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id, name) {
  return jwt.sign({ id, name }, process.env.JWT_SECRET);
}

const signUp = async (req, res, next) => {
  console.log("I am in signUp");
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateAccessToken(user.id, user.name);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.findAll({
      attributes: ["id", "name"],
    });
    res.status(200).json(authors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch authors." });
  }
};

module.exports = { signUp, login, getAuthors };
