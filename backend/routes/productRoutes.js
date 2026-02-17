const express = require('express');
const router = express.Router();
const { 
  getProducts,
  getWholesaleProducts,
  getRetailProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  uploadProductImages
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/wholesale', getWholesaleProducts);
router.get('/retail', getRetailProducts);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/:id', getProductById);
router.get('/', getProducts);

// Protected routes (Admin only)
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Image upload
router.post('/upload', protect, adminOnly, upload.array('images', 10), uploadProductImages);

module.exports = router;
