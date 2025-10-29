// backend controller
const jwt = require("jsonwebtoken");
const UserDataModel = require("../model/UserDataModel");

// Use environment variable or fallback secret
const JWT_SECRET = process.env.JWT_SECRET;

// Create new user 
const CreateUser = async (req, res) => {
  try {
    const { name, phone, email, address, password } = req.body;

    console.log(req.body);

    // check if user already exists
    const existingUser = await UserDataModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // create new user (plain-text password, not secure!)
    const adduser = new UserDataModel({
      name,
      phone,
      email,
      address,
      password,
    });

    await adduser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false, error: err });
  }
};

// Login user
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Use correct model
    const user = await UserDataModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Plain-text comparison (⚠️ insecure)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, address: user.address, mobile: user.phone },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  CreateUser,
  LoginUser,
};
