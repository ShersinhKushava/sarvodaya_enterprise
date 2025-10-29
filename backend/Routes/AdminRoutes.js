// routes/adminRoutes.js

const {
  loginAdmin,
  addAdmin,
  getAdminProfile,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changePassword,
  AddCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} = require("../Controllers/adminController");
const { protect } = require("../Middleware/adminauthMiddleware");
const upload = require("../Middleware/uploadMiddleware");

const router = require("express").Router();

// Public route — Login
router.post("/login", loginAdmin);

// Protected route — Add new admin
router.post("/add", protect, upload.single('image'), addAdmin);

// Protected route — Get admin info
router.get("/profile", protect, getAdminProfile);

//add cateogry
router.post("/addcategory", AddCategory);

//get category
router.get("/getCatgory", getCategories);

//delete category
router.delete("/delcat/:id" , deleteCategory)

//update category
router.put("/updateCategor/:id", updateCategory)

// Protected routes — Admin CRUD
router.get("/all", protect, getAllAdmins);
router.put("/update/:id", protect, updateAdmin);
router.delete("/delete/:id", protect, deleteAdmin);

// Protected route — Change password
router.put("/change-password", protect, changePassword);

// Todo routes
router.get("/todos", protect, getTodos);
router.post("/todos", protect, addTodo);
router.put("/todos/:id", protect, updateTodo);
router.delete("/todos/:id", protect, deleteTodo);

module.exports = router;
