// controllers/adminController.js
// import Admin from "../model/Admin";
const Admin = require('../model/Admin')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');  // Add this line to import bcrypt
const Category = require('../model/Category');
const Todo = require('../model/Todo');
/**
 * Admin Login Controller
 */
const loginAdmin = async (req, res) => {
    console.log(req.body)
  try {
    console.log("entred in try block")
    console.log(req.body)
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    else{
        console.log("admin matched")
    }

    // // Compare password
    // const isMatch = await bcrypt.compare(password, Admin.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid email or password" });
    // }
    // else{
    //     console.log("password matched")
    // }
    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    else {
        console.log("password matched");
    }


    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.log("enterd in catch block")
  }
};

/**
 * Create a new Admin (only accessible by logged-in admins)
 */
const addAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const image = req.file ? req.file.filename : '';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      image,
    });

    await newAdmin.save();

    res.status(201).json({ message: "New admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get logged-in admin info
 */
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const AddCategory = async (req,res) =>{
 try {
    
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}

// Get all categories
const getCategories = async (req, res) => {
    try {
        
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get all admins (only accessible by logged-in admins)
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update admin (only accessible by logged-in admins)
 */
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, image } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updateData = { name, email, role, image };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete admin (only accessible by logged-in admins)
 */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deleting the last admin
    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) {
      return res.status(400).json({ message: "Cannot delete the last admin" });
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Change password for logged-in admin
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password using bcrypt
    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Todo functions
const getTodos = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const todos = await Todo.find({ adminId }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addTodo = async (req, res) => {
  try {
    const { task } = req.body;
    const adminId = req.admin.id;

    if (!task || task.trim() === '') {
      return res.status(400).json({ message: "Task is required" });
    }

    const newTodo = new Todo({
      task: task.trim(),
      adminId,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;
    const adminId = req.admin.id;

    const todo = await Todo.findOne({ _id: id, adminId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updateData = {};
    if (task !== undefined) updateData.task = task.trim();
    if (completed !== undefined) updateData.completed = completed;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;

    const todo = await Todo.findOneAndDelete({ _id: id, adminId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAdminProfile,
  addAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changePassword,
  AddCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};
