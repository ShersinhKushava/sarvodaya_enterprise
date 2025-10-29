const express = require("express");
const router = express.Router();
const { placeOrder, getUserOrders, getAllOrders, getAllCompletedOrders, getUserCompletedOrders, updateOrderStatus, generateInvoice, uploadInvoice, downloadInvoice, upload } = require("../Controllers/orderController");
const { protect } = require("../Middleware/adminauthMiddleware");

// POST /api/order/place-order
router.post("/place-order", placeOrder);

// GET /api/order/user-orders?userId=...&userEmail=...
router.get("/user-orders", getUserOrders);

// GET /api/order/all-orders (admin)
router.get("/all-orders", protect, getAllOrders);

// PUT /api/order/update-status
router.put("/update-status", protect, upload.single('invoiceFile'), updateOrderStatus);

// GET /api/order/generate-invoice/:orderId (admin)
router.get("/generate-invoice/:orderId", protect, generateInvoice);

// GET /api/order/all-completed-orders (admin)
router.get("/all-completed-orders", protect, getAllCompletedOrders);

// GET /api/order/user-completed-orders (user)
router.get("/user-completed-orders", getUserCompletedOrders);

// POST /api/order/upload-invoice/:orderId (admin)
router.post("/upload-invoice/:orderId", protect, upload.single('invoice'), uploadInvoice);

// GET /api/order/download-invoice/:orderId (user)
router.get("/download-invoice/:orderId", downloadInvoice);

module.exports = router;
