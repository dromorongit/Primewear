// ================================================
// Prime Wear Wholesale - Products API Service
// ================================================

// API Base URL - Points to backend server
const API_BASE_URL = window.location.origin + '/api';

// Products data from API
let productsData = [];
let isLoading = false;

// Fetch all products from API
async function fetchProducts() {
    if (isLoading) return productsData;
    isLoading = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products?limit=100`);
        if (response.ok) {
            const data = await response.json();
            productsData = data.products.map(transformProduct);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        isLoading = false;
    }
    
    return productsData;
}

// Fetch wholesale products
async function fetchWholesaleProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/wholesale?limit=100`);
        if (response.ok) {
            const data = await response.json();
            return data.products.map(transformProduct);
        }
    } catch (error) {
        console.error('Error fetching wholesale products:', error);
    }
    return [];
}

// Fetch retail products
async function fetchRetailProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/retail?limit=100`);
        if (response.ok) {
            const data = await response.json();
            return data.products.map(transformProduct);
        }
    } catch (error) {
        console.error('Error fetching retail products:', error);
    }
    return [];
}

// Fetch featured products
async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/featured`);
        if (response.ok) {
            const data = await response.json();
            return data.map(transformProduct);
        }
    } catch (error) {
        console.error('Error fetching featured products:', error);
    }
    return [];
}

// Transform backend product to frontend format
function transformProduct(product) {
    return {
        id: product._id,
        _id: product._id,
        name: product.name,
        category: product.categories && product.categories.length > 0 ? product.categories[0] : 'General',
        type: product.wholesale_price ? 'wholesale' : 'retail',
        short_description: product.short_description,
        long_description: product.long_description,
        price: product.retail_price || product.sales_price || 0,
        wholesale_price: product.wholesale_price,
        sales_price: product.sales_price,
        moq: product.minimum_order_quantity,
        images: product.main_image ? [product.main_image, ...(product.additional_images || [])] : [],
        main_image: product.main_image,
        additional_images: product.additional_images || [],
        stock: product.stock,
        sizes: product.sizes || [],
        colors: product.colors || [],
        is_featured: product.is_featured,
        categories: product.categories || [],
        created_at: product.created_at
    };
}

// Helper functions
function getProductsByType(type) {
    return productsData.filter(product => product.type === type);
}

function getProductsByCategory(category) {
    return productsData.filter(product => 
        product.category === category || 
        (product.categories && product.categories.includes(category))
    );
}

function getProductById(id) {
    return productsData.find(product => product.id === id || product._id === id);
}

function getAllProducts() {
    return productsData;
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.category && product.category.toLowerCase().includes(searchTerm)) ||
        product.short_description.toLowerCase().includes(searchTerm)
    );
}

function sortProducts(products, sortBy) {
    switch(sortBy) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'name-asc':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...products].sort((a, b) => b.name.localeCompare(a.name));
        default:
            return products;
    }
}

// Initialize products on load
if (typeof window !== 'undefined') {
    fetchProducts();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsData,
        fetchProducts,
        fetchWholesaleProducts,
        fetchRetailProducts,
        fetchFeaturedProducts,
        getProductsByType,
        getProductsByCategory,
        getProductById,
        getAllProducts,
        searchProducts,
        sortProducts
    };
}
