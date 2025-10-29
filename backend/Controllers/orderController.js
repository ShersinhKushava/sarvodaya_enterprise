const Order = require("../model/Order");
const CompletedOrder = require("../model/CompletedOrder");
const Cart = require("../model/Cart");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Generate a unique order ID
const generateOrderId = () => {
  return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

// Place an order
const placeOrder = async (req, res) => {
  try {
    const { userId, userEmail, shippingDetails, userDetails, products, totalSum } = req.body;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in the order" });
    }

    if (!totalSum || totalSum <= 0) {
      return res.status(400).json({ message: "Invalid total sum" });
    }

    // Generate unique order ID
    const orderId = generateOrderId();

    // Create new order
    const order = new Order({
      userId,
      userEmail,
      userDetails,
      shippingDetails,
      products,
      totalSum,
      orderId,
      status: "pending"
    });

    const savedOrder = await order.save();

    // Clear the cart after successful order placement
    await Cart.deleteMany({ userId, userEmail });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder.orderId,
      order: savedOrder
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders for a user
const getUserOrders = async (req, res) => {
  try {
    const { userId, userEmail } = req.query;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const orders = await Order.find({ userId, userEmail }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all completed orders (for admin)
const getAllCompletedOrders = async (req, res) => {
  try {
    const completedOrders = await CompletedOrder.find().sort({ createdAt: -1 });

    res.status(200).json(completedOrders);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user completed orders (for user)
const getUserCompletedOrders = async (req, res) => {
  try {
    const { userId, userEmail } = req.query;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const completedOrders = await CompletedOrder.find({ userId, userEmail }).sort({ createdAt: -1 });

    res.status(200).json(completedOrders);
  } catch (error) {
    console.error("Error fetching user completed orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, invoice, trackingLink } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    if (status === 'dispatched') {
      // Find the order in the Order collection
      const order = await Order.findOne({ orderId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Create completed order
      const completedOrder = new CompletedOrder({
        userId: order.userId,
        userEmail: order.userEmail,
        userDetails: order.userDetails,
        shippingDetails: order.shippingDetails,
        products: order.products,
        totalSum: order.totalSum,
        orderId: order.orderId,
        status: 'completed',
        invoice: invoice || '',
        trackingLink: trackingLink || '',
        invoiceFile: req.file ? req.file.path : null,
        dispatchedAt: new Date(),
        createdAt: order.createdAt
      });

      await completedOrder.save();

      // Remove from Order collection
      await Order.findOneAndDelete({ orderId });

      res.status(200).json(completedOrder);
    } else {
      // For other status updates, update in Order collection
      const updateData = { status };
      if (invoice) updateData.invoice = invoice;
      if (trackingLink) updateData.trackingLink = trackingLink;

      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        updateData,
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(updatedOrder);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate PDF invoice
const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // First try to find in Order collection, then in CompletedOrder collection
    let order = await Order.findOne({ orderId }).populate('userId');

    if (!order) {
      order = await CompletedOrder.findOne({ orderId }).populate('userId');
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const invoicePath = path.join(__dirname, '../invoices', `invoice-${orderId}.pdf`);

    // Ensure invoices directory exists
    const invoicesDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Pipe the PDF to a file
    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    // Add content to PDF
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order.orderId}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.text('Customer Details:');
    doc.text(`Name: ${order.userDetails?.name || 'N/A'}`);
    doc.text(`Email: ${order.userEmail}`);
    doc.moveDown();

    doc.text('Shipping Details:');
    doc.text(`Address: ${order.shippingDetails?.address || 'N/A'}`);
    doc.text(`City: ${order.shippingDetails?.city || 'N/A'}`);
    doc.text(`State: ${order.shippingDetails?.state || 'N/A'}`);
    doc.text(`Pincode: ${order.shippingDetails?.pincode || 'N/A'}`);
    doc.moveDown();

    doc.text('Products:');
    order.products.forEach((product, index) => {
      doc.text(`${index + 1}. ${product.name} - Quantity: ${product.quantity} - Original Price: Rs. ${product.price} - After Discount: Rs. ${product.afterDiscountPrice}`);
    });
    doc.moveDown();

    doc.fontSize(14).text(`Total Amount: Rs. ${order.totalSum}`, { align: 'right' });
    doc.moveDown();

    if (order.status === 'dispatched') {
      doc.text(`Status: ${order.status}`);
      if (order.invoice) doc.text(`Invoice Number: ${order.invoice}`);
      if (order.trackingLink) doc.text(`Tracking Link: ${order.trackingLink}`);
    } else {
      doc.text(`Status: ${order.status}`);
    }

    // Finalize the PDF
    doc.end();

    writeStream.on('finish', () => {
      res.download(invoicePath, `invoice-${orderId}.pdf`, (err) => {
        if (err) {
          console.error('Error downloading invoice:', err);
          res.status(500).json({ message: 'Error downloading invoice' });
        }
        // Optionally delete the file after download
        fs.unlinkSync(invoicePath);
      });
    });

  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/invoices');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'invoice-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload invoice for completed order
const uploadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const completedOrder = await CompletedOrder.findOne({ orderId });

    if (!completedOrder) {
      return res.status(404).json({ message: 'Completed order not found' });
    }

    // Update the order with the invoice file path
    completedOrder.invoiceFile = req.file.path;
    await completedOrder.save();

    res.status(200).json({
      message: 'Invoice uploaded successfully',
      invoiceFile: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download uploaded invoice
const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const completedOrder = await CompletedOrder.findOne({ orderId });

    if (!completedOrder || !completedOrder.invoiceFile) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const filePath = path.resolve(completedOrder.invoiceFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Invoice file not found' });
    }

    res.download(filePath, `invoice-${orderId}.pdf`);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, getAllCompletedOrders, getUserCompletedOrders, updateOrderStatus, generateInvoice, uploadInvoice, downloadInvoice, upload };
