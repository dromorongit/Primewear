// Prime Wear Admin Panel JavaScript
// API Base URL - Update this for production
const API_BASE_URL = 'https://primewear-production.up.railway.app/api';

// State
let authToken = localStorage.getItem('adminToken');
let currentPage = 1;
let totalPages = 1;
let productsData = [];

// Store uploaded images temporarily
let uploadedMainImage = '';
let uploadedAdditionalImages = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
});

// Check authentication
function checkAuth() {
  if (authToken) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'flex';
    loadDashboardStats();
  }
}

// Event Listeners
function setupEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page;
      navigateTo(page);
    });
  });

  // Mobile menu toggle
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('active');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.add('active');
  });

  document.getElementById('close-sidebar').addEventListener('click', () => {
    closeSidebar();
  });

  // Close sidebar when clicking overlay
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // Search and filters
  document.getElementById('search-products').addEventListener('input', debounce(loadProducts, 500));
  document.getElementById('filter-category').addEventListener('change', () => { currentPage = 1; loadProducts(); });
  document.getElementById('filter-type').addEventListener('change', () => { currentPage = 1; loadProducts(); });
  document.getElementById('filter-featured').addEventListener('change', () => { currentPage = 1; loadProducts(); });

  // Add product form
  document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);

  // Edit product form
  document.getElementById('edit-product-form').addEventListener('submit', handleEditProduct);

  // Image upload
  const imageInput = document.getElementById('main-image-input');
  if (imageInput) {
    imageInput.addEventListener('change', handleImagePreview);
    imageInput.addEventListener('change', handleImageUpload);
  }

  // Additional images upload
  const additionalImageInput = document.getElementById('additional-images-input');
  if (additionalImageInput) {
    additionalImageInput.addEventListener('change', handleAdditionalImagePreview);
    additionalImageInput.addEventListener('change', handleAdditionalImageUpload);
  }

  // Edit image upload
  const editImageInput = document.getElementById('edit-image-input');
  if (editImageInput) {
    editImageInput.addEventListener('change', handleEditImagePreview);
    editImageInput.addEventListener('change', handleEditImageUpload);
  }
}

// Login Handler
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      localStorage.setItem('adminToken', authToken);
      errorDiv.textContent = '';
      checkAuth();
    } else {
      errorDiv.textContent = data.message || 'Login failed';
    }
  } catch (error) {
    errorDiv.textContent = 'Connection error. Please try again.';
    console.error('Login error:', error);
  }
}

// Logout
function logout() {
  localStorage.removeItem('adminToken');
  authToken = null;
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('admin-section').style.display = 'none';
  document.getElementById('login-form').reset();
}

// Navigate to page
function navigateTo(page) {
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) {
      link.classList.add('active');
    }
  });

  // Show page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageElement = document.getElementById(`${page}-page`);
  if (pageElement) {
    pageElement.classList.add('active');
  }

  // Close mobile sidebar
  closeSidebar();

  // Load data based on page
  if (page === 'dashboard') {
    loadDashboardStats();
  } else if (page === 'manage-products') {
    loadProducts();
  }
}

// Close sidebar function
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// Dashboard Stats
async function loadDashboardStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/stats`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      const stats = await response.json();
      animateValue('total-products', stats.totalProducts);
      animateValue('wholesale-products', stats.totalWholesaleProducts);
      animateValue('retail-products', stats.totalRetailProducts);
      animateValue('low-stock', stats.lowStockItems);
    } else if (response.status === 401) {
      logout();
    }
  } catch (error) {
    console.error('Load stats error:', error);
  }
}

// Animate counter
function animateValue(elementId, end) {
  const element = document.getElementById(elementId);
  const start = 0;
  const duration = 1000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Load Products
async function loadProducts() {
  const search = document.getElementById('search-products').value;
  const category = document.getElementById('filter-category').value;
  const type = document.getElementById('filter-type').value;
  const featured = document.getElementById('filter-featured').value;

  let queryParams = new URLSearchParams({
    page: currentPage,
    limit: 10
  });

  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);
  if (featured) queryParams.append('featured', featured);

  // Handle type filter (wholesale/retail)
  if (type === 'wholesale') {
    try {
      const response = await fetch(`${API_BASE_URL}/products/wholesale?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      renderProducts(data.products);
      renderPagination(data.totalPages);
      return;
    } catch (error) {
      console.error('Error:', error);
    }
  } else if (type === 'retail') {
    try {
      const response = await fetch(`${API_BASE_URL}/products/retail?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      renderProducts(data.products);
      renderPagination(data.totalPages);
      return;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      productsData = data.products;
      renderProducts(data.products);
      renderPagination(data.totalPages);
    } else if (response.status === 401) {
      logout();
    }
  } catch (error) {
    console.error('Load products error:', error);
  }
}

// Render Products Table
function renderProducts(products) {
  const tbody = document.getElementById('products-table-body');
  
  if (!products || products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>
        ${product.main_image 
          ? `<img src="${product.main_image}" alt="${product.name}" class="product-image">`
          : `<div class="no-image"><i class="fas fa-image"></i></div>`
        }
      </td>
      <td>
        <strong>${product.name}</strong><br>
        <small style="color: #666;">${product.short_description.substring(0, 50)}...</small>
      </td>
      <td>
        ${product.categories.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
      </td>
      <td>
        <div class="price-info">
          ${product.wholesale_price ? `<div class="wholesale">W: $${product.wholesale_price.toFixed(2)}</div>` : ''}
          ${product.retail_price ? `<div class="retail">R: $${product.retail_price.toFixed(2)}</div>` : ''}
          ${product.sales_price ? `<div style="color: #e74c3c;">S: $${product.sales_price.toFixed(2)}</div>` : ''}
        </div>
      </td>
      <td class="${product.stock < 10 ? 'stock-warning' : ''}">
        ${product.stock}
        ${product.stock < 10 ? '<br><small>Low Stock</small>' : ''}
      </td>
      <td>
        ${product.is_featured ? '<span class="featured-badge">Featured</span>' : '-'}
      </td>
      <td>
        <div class="actions">
          <button class="action-btn-table edit-btn" onclick="openEditModal('${product._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn-table delete-btn" onclick="deleteProduct('${product._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Render Pagination
function renderPagination(total) {
  totalPages = total;
  const pagination = document.getElementById('pagination');
  
  if (total <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '';
  
  // Previous button
  html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
    <i class="fas fa-chevron-left"></i>
  </button>`;

  // Page numbers
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<button disabled>...</button>`;
    }
  }

  // Next button
  html += `<button ${currentPage === total ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
    <i class="fas fa-chevron-right"></i>
  </button>`;

  pagination.innerHTML = html;
}

// Go to page
function goToPage(page) {
  currentPage = page;
  loadProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add Product Handler
async function handleAddProduct(e) {
  e.preventDefault();
  const form = e.target;
  const messageDiv = document.getElementById('form-message');

  // Show loading
  messageDiv.textContent = 'Uploading images...';
  messageDiv.className = 'form-message';
  messageDiv.style.display = 'block';

  // Get the file inputs
  const mainImageInput = document.getElementById('main-image-input');
  const additionalImageInput = document.getElementById('additional-images-input');
  const mainFiles = mainImageInput ? mainImageInput.files : [];
  const additionalFiles = additionalImageInput ? additionalImageInput.files : [];

  let mainImage = uploadedMainImage;
  let additionalImages = [...uploadedAdditionalImages];

  // Upload main image to Cloudinary if file selected
  if (mainFiles.length > 0) {
    try {
      const formData = new FormData();
      formData.append('images', mainFiles[0]);

      const uploadResponse = await fetch(`${API_BASE_URL}/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        if (uploadData.urls && uploadData.urls.length > 0) {
          mainImage = uploadData.urls[0];
        }
      }
    } catch (error) {
      console.error('Main image upload error:', error);
    }
  }

  // Upload additional images to Cloudinary if files selected
  if (additionalFiles.length > 0) {
    try {
      const formData = new FormData();
      for (let i = 0; i < additionalFiles.length; i++) {
        formData.append('images', additionalFiles[i]);
      }

      const uploadResponse = await fetch(`${API_BASE_URL}/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        if (uploadData.urls && uploadData.urls.length > 0) {
          additionalImages = [...additionalImages, ...uploadData.urls];
        }
      }
    } catch (error) {
      console.error('Additional images upload error:', error);
    }
  }

  // Collect form data
  const formData = {
    name: form.name.value,
    wholesale_price: form.wholesale_price.value ? parseFloat(form.wholesale_price.value) : null,
    retail_price: form.retail_price.value ? parseFloat(form.retail_price.value) : null,
    sales_price: form.sales_price.value ? parseFloat(form.sales_price.value) : null,
    short_description: form.short_description.value,
    long_description: form.long_description.value,
    stock: parseInt(form.stock.value) || 0,
    minimum_order_quantity: form.minimum_order_quantity.value ? parseInt(form.minimum_order_quantity.value) : null,
    is_featured: form.is_featured.checked,
    sizes: form.sizes.value ? form.sizes.value.split(',').map(s => s.trim()) : [],
    colors: form.colors.value ? form.colors.value.split(',').map(c => c.trim()) : [],
    main_image: mainImage,
    additional_images: additionalImages
  };

  // Get selected categories
  const categories = [];
  form.querySelectorAll('input[name="categories"]:checked').forEach(cb => {
    categories.push(cb.value);
  });
  formData.categories = categories;

  // Validate
  if (!formData.wholesale_price && !formData.retail_price) {
    messageDiv.textContent = 'Product must have at least wholesale or retail price';
    messageDiv.className = 'form-message error';
    return;
  }

  if (formData.wholesale_price && !formData.minimum_order_quantity) {
    messageDiv.textContent = 'Minimum order quantity is required for wholesale products';
    messageDiv.className = 'form-message error';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = 'Product added successfully!';
      messageDiv.className = 'form-message success';
      form.reset();
      // Clear uploaded images
      uploadedMainImage = '';
      uploadedAdditionalImages = [];
      document.getElementById('image-preview').innerHTML = '';
      document.getElementById('additional-image-preview').innerHTML = '';
      loadDashboardStats();
      setTimeout(() => {
        messageDiv.className = 'form-message';
      }, 3000);
    } else {
      messageDiv.textContent = data.message || 'Failed to add product';
      messageDiv.className = 'form-message error';
    }
  } catch (error) {
    messageDiv.textContent = 'Error connecting to server';
    messageDiv.className = 'form-message error';
    console.error('Add product error:', error);
  }
}

// Open Edit Modal
function openEditModal(productId) {
  const product = productsData.find(p => p._id === productId);
  if (!product) return;

  document.getElementById('edit-product-id').value = product._id;
  document.getElementById('edit-name').value = product.name;
  document.getElementById('edit-wholesale-price').value = product.wholesale_price || '';
  document.getElementById('edit-retail-price').value = product.retail_price || '';
  document.getElementById('edit-sales-price').value = product.sales_price || '';
  document.getElementById('edit-short-description').value = product.short_description;
  document.getElementById('edit-long-description').value = product.long_description || '';
  document.getElementById('edit-stock').value = product.stock;
  document.getElementById('edit-min-order').value = product.minimum_order_quantity || '';
  document.getElementById('edit-is-featured').checked = product.is_featured;
  
  // Store current images
  uploadedMainImage = product.main_image || '';
  uploadedAdditionalImages = product.additional_images || [];
  
  // Show current images in preview
  const previewContainer = document.getElementById('edit-image-preview');
  previewContainer.innerHTML = '';
  
  if (product.main_image) {
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = `
      <img src="${product.main_image}" alt="Main Image">
    `;
    previewContainer.appendChild(div);
  }

  // Set categories
  document.querySelectorAll('#edit-categories input[name="categories"]').forEach(cb => {
    cb.checked = product.categories.includes(cb.value);
  });

  document.getElementById('edit-modal').classList.add('active');
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('active');
}

// Handle Edit Product
async function handleEditProduct(e) {
  e.preventDefault();
  const form = e.target;
  const productId = document.getElementById('edit-product-id').value;

  // Get the file input
  const imageInput = document.getElementById('edit-image-input');
  const files = imageInput ? imageInput.files : [];

  let mainImage = uploadedMainImage;
  let additionalImages = [...uploadedAdditionalImages];

  // Upload new images to Cloudinary if files selected
  if (files.length > 0) {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const uploadResponse = await fetch(`${API_BASE_URL}/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        if (uploadData.urls && uploadData.urls.length > 0) {
          // If new main image uploaded, use it
          if (!uploadedMainImage) {
            mainImage = uploadData.urls[0];
            additionalImages = uploadData.urls.slice(1);
          } else {
            // Add to additional images
            additionalImages = [...additionalImages, ...uploadData.urls];
          }
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
    }
  }

  const formData = {
    name: form.name.value,
    wholesale_price: form.wholesale_price.value ? parseFloat(form.wholesale_price.value) : null,
    retail_price: form.retail_price.value ? parseFloat(form.retail_price.value) : null,
    sales_price: form.sales_price.value ? parseFloat(form.sales_price.value) : null,
    short_description: form.short_description.value,
    long_description: form.long_description.value,
    stock: parseInt(form.stock.value),
    minimum_order_quantity: form.minimum_order_quantity.value ? parseInt(form.minimum_order_quantity.value) : null,
    is_featured: form.is_featured.checked,
    main_image: mainImage,
    additional_images: additionalImages
  };

  // Get selected categories
  const categories = [];
  form.querySelectorAll('#edit-categories input[name="categories"]:checked').forEach(cb => {
    categories.push(cb.value);
  });
  formData.categories = categories;

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Product updated successfully!');
      closeEditModal();
      loadProducts();
      loadDashboardStats();
    } else {
      alert(data.message || 'Failed to update product');
    }
  } catch (error) {
    alert('Error connecting to server');
    console.error('Edit product error:', error);
  }
}

// Delete Product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      alert('Product deleted successfully!');
      loadProducts();
      loadDashboardStats();
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to delete product');
    }
  } catch (error) {
    alert('Error connecting to server');
    console.error('Delete product error:', error);
  }
}

// Image Upload to Cloudinary - Add Product
async function handleImageUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/products/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        uploadedMainImage = data.urls[0];
      }
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Additional Images Preview Handler
function handleAdditionalImagePreview(e) {
  const files = e.target.files;
  const previewContainer = document.getElementById('additional-image-preview');
  previewContainer.innerHTML = '';

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// Additional Images Upload to Cloudinary
async function handleAdditionalImageUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/products/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        uploadedAdditionalImages = [...uploadedAdditionalImages, ...data.urls];
      }
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Image Upload to Cloudinary - Edit Product
async function handleEditImageUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/products/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        uploadedAdditionalImages = [...uploadedAdditionalImages, ...data.urls];
      }
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Edit Image Preview Handler
function handleEditImagePreview(e) {
  const files = e.target.files;
  const previewContainer = document.getElementById('edit-image-preview');
  
  if (!files || files.length === 0) {
    return;
  }

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
      `;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// Image Preview Handler
function handleImagePreview(e) {
  const files = e.target.files;
  const previewContainer = document.getElementById('image-preview');
  previewContainer.innerHTML = '';

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Close modal when clicking outside
document.getElementById('edit-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeEditModal();
  }
});
