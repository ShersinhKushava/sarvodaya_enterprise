const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
const cors = require("cors");
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import your routes
const UserRoutes = require("./Routes/UsersRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const productRoutes = require("./Routes/productRoutes");
const blogRoutes = require("./Routes/blogRoutes");

const cartRoutes = require("./Routes/cartRoutes"); // NEW: Cart routes
const orderRoutes = require("./Routes/orderRoutes"); // NEW: Order routes





// Connect to DB
const connectDB = require("./model/db");
connectDB();

// Seed default admin if not exists
const seedDefaultAdmin = async () => {
  try {
    const Admin = require('./model/Admin');
    const bcrypt = require('bcrypt');

    const existingAdmin = await Admin.findOne({ email: '78sr00@gmail.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('1234', 10);
      const defaultAdmin = new Admin({
        name: 'Super Admin',
        email: '78sr00@gmail.com',
        password: hashedPassword,
        role: 'super-admin',
        image: '',
      });
      await defaultAdmin.save();
      console.log('Default admin created: 78sr00@gmail.com / 1234');
    } else {
      console.log('Default admin already exists');
    }
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
};

// Seed after DB connection
setTimeout(seedDefaultAdmin, 5000);

// Home route
app.get("/", (req, res) => {
  res.send("Jay Shree Ram");
});

// API routes
app.use("/api/User", UserRoutes);//admin
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes); // NEW: Product routes
app.use("/api/blogs", blogRoutes); // NEW: Blog routes
app.use("/api/cart", cartRoutes);// NEW: Add cart route
app.use("/api/order", orderRoutes);// NEW: Add order route



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
