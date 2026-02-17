const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      featured, 
      search,
      sort = '-created_at',
      minPrice,
      maxPrice
    } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category) {
      query.categories = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.is_featured = true;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.$or = query.$or || [];
      if (minPrice && maxPrice) {
        query.$or.push(
          { wholesale_price: { $gte: minPrice, $lte: maxPrice } },
          { retail_price: { $gte: minPrice, $lte: maxPrice } }
        );
      } else if (minPrice) {
        query.$or.push(
          { wholesale_price: { $gte: minPrice } },
          { retail_price: { $gte: minPrice } }
        );
      } else if (maxPrice) {
        query.$or.push(
          { wholesale_price: { $lte: maxPrice } },
          { retail_price: { $lte: maxPrice } }
        );
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wholesale products
// @route   GET /api/products/wholesale
// @access  Public
const getWholesaleProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, search, sort = '-created_at' } = req.query;

    // Only products with wholesale_price
    let query = { wholesale_price: { $exists: true, $ne: null } };

    if (featured === 'true') {
      query.is_featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    console.error('Get wholesale products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get retail products
// @route   GET /api/products/retail
// @access  Public
const getRetailProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, search, sort = '-created_at' } = req.query;

    // Only products with retail_price
    let query = { retail_price: { $exists: true, $ne: null } };

    if (featured === 'true') {
      query.is_featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    console.error('Get retail products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let query = { is_featured: true };

    if (type === 'wholesale') {
      query.wholesale_price = { $exists: true, $ne: null };
    } else if (type === 'retail') {
      query.retail_price = { $exists: true, $ne: null };
    }

    const products = await Product.find(query).sort('-created_at');

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      wholesale_price,
      retail_price,
      sales_price,
      short_description,
      long_description,
      stock,
      minimum_order_quantity,
      categories,
      is_featured,
      sizes,
      colors,
      main_image,
      additional_images
    } = req.body;

    // Business logic: Prevent product without any price
    if (!wholesale_price && !retail_price) {
      return res.status(400).json({ 
        message: 'Product must have at least one price (wholesale or retail)' 
      });
    }

    // Business logic: Minimum order quantity required for wholesale
    if (wholesale_price && !minimum_order_quantity) {
      return res.status(400).json({ 
        message: 'Minimum order quantity is required for wholesale products' 
      });
    }

    const product = new Product({
      name,
      wholesale_price: wholesale_price || null,
      retail_price: retail_price || null,
      sales_price: sales_price || null,
      short_description,
      long_description: long_description || '',
      stock: stock || 0,
      minimum_order_quantity: minimum_order_quantity || null,
      categories: categories || [],
      is_featured: is_featured || false,
      sizes: sizes || [],
      colors: colors || [],
      main_image: main_image || '',
      additional_images: additional_images || []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      wholesale_price,
      retail_price,
      sales_price,
      short_description,
      long_description,
      stock,
      minimum_order_quantity,
      categories,
      is_featured,
      sizes,
      colors,
      main_image,
      additional_images
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Business logic: Prevent product without any price
    if (!wholesale_price && !retail_price && !product.wholesale_price && !product.retail_price) {
      return res.status(400).json({ 
        message: 'Product must have at least one price (wholesale or retail)' 
      });
    }

    // Business logic: Minimum order quantity required for wholesale
    const hasWholesale = wholesale_price !== undefined ? wholesale_price : product.wholesale_price;
    if (hasWholesale && !minimum_order_quantity && !product.minimum_order_quantity) {
      return res.status(400).json({ 
        message: 'Minimum order quantity is required for wholesale products' 
      });
    }

    // Update fields
    product.name = name || product.name;
    product.wholesale_price = wholesale_price !== undefined ? wholesale_price : product.wholesale_price;
    product.retail_price = retail_price !== undefined ? retail_price : product.retail_price;
    product.sales_price = sales_price !== undefined ? sales_price : product.sales_price;
    product.short_description = short_description || product.short_description;
    product.long_description = long_description !== undefined ? long_description : product.long_description;
    product.stock = stock !== undefined ? stock : product.stock;
    product.minimum_order_quantity = minimum_order_quantity !== undefined ? minimum_order_quantity : product.minimum_order_quantity;
    product.categories = categories || product.categories;
    product.is_featured = is_featured !== undefined ? is_featured : product.is_featured;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.main_image = main_image !== undefined ? main_image : product.main_image;
    product.additional_images = additional_images !== undefined ? additional_images : product.additional_images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary if they exist
    if (product.main_image) {
      try {
        const publicId = product.main_image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`primewear/${publicId}`);
      } catch (err) {
        console.error('Error deleting main image from Cloudinary:', err);
      }
    }

    if (product.additional_images && product.additional_images.length > 0) {
      for (const imageUrl of product.additional_images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`primewear/${publicId}`);
        } catch (err) {
          console.error('Error deleting additional image from Cloudinary:', err);
        }
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/products/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    const wholesaleProducts = await Product.countDocuments({ 
      wholesale_price: { $exists: true, $ne: null } 
    });
    
    const retailProducts = await Product.countDocuments({ 
      retail_price: { $exists: true, $ne: null } 
    });
    
    const lowStockItems = await Product.countDocuments({ 
      stock: { $lt: 10 } 
    });

    const featuredProducts = await Product.countDocuments({ is_featured: true });

    res.json({
      totalProducts,
      totalWholesaleProducts: wholesaleProducts,
      totalRetailProducts: retailProducts,
      lowStockItems,
      featuredProducts
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Admin
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => file.path);
    res.json({ urls: imageUrls });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
