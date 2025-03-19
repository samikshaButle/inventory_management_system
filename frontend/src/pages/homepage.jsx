import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Edit, Trash2, X } from 'lucide-react';
import './homepage.css';
import axios from 'axios';

// Sample categories
const categories = ['Electronics', 'Furniture', 'Appliances', 'Office Supplies', 'Other'];

function Homepage({ addNotification }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    category: '',
    quantity: 0,
    cost: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortOption, setSortOption] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to fetch inventory data from the backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/inventory/getInventory', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      addNotification('Failed to fetch inventory data', 'error');
    }
  };

  // Fetch inventory data from the backend
  useEffect(() => {
    fetchInventory();
  }, [refreshTrigger]);


  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddProduct = async () => {
    if (!newProduct.productName || !newProduct.category || newProduct.cost <= 0) {
      addNotification('Please fill in all fields', 'error');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/inventory/postInventory',
        newProduct,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        setShowAddModal(false);
        setNewProduct({ productName: '', category: '', quantity: 0, cost: 0 });
        addNotification(`Added new product: ${newProduct.productName}`, 'success');
        refreshData(); // Refresh data after adding
      }
    } catch (error) {
      console.error('Error adding product:', error);
      addNotification('Failed to add product', 'error');
    }
  };

  const handleEditProduct = async () => {
    if (!currentProduct.productName || !currentProduct.category || currentProduct.cost <= 0) {
      addNotification('Please fill in all fields', 'error');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/inventory/updateInventory/${currentProduct._id}`,
        currentProduct,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        setShowEditModal(false);
        addNotification(`Updated product: ${currentProduct.productName}`, 'info');
        refreshData(); // Refresh data after editing
      }
    } catch (error) {
      console.error('Error updating product:', error);
      addNotification('Failed to update product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/inventory/deleteInventory/${id}`,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        addNotification(`Deleted product successfully`, 'error');
        refreshData(); // Refresh data after deleting
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      addNotification('Failed to delete product', 'error');
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct({ ...product });
    setShowEditModal(true);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const applySort = (option) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const resetFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const productName = product.productName || ''; // Default to empty string if undefined
    const category = product.category || ''; // Default to empty string if undefined

    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || category === filters.category;
    const matchesMinPrice = !filters.minPrice || product.cost >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.cost <= Number(filters.maxPrice);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low-high':
        return a.cost - b.cost;
      case 'price-high-low':
        return b.cost - a.cost;
      case 'name-a-z':
        return a.productName.localeCompare(b.productName);
      case 'name-z-a':
        return b.productName.localeCompare(a.productName);
      case 'quantity-low-high':
        return a.quantity - b.quantity;
      case 'quantity-high-low':
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });

  return (
    <div className="homepage">
      <div className="toolbar">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          <button className="action-button" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>

          <button className="action-button" onClick={() => setShowFilterModal(true)}>
            <Filter size={18} />
            <span>Filter</span>
          </button>

          <button className="action-button" onClick={() => setShowSortModal(true)}>
            <ArrowUpDown size={18} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.category || filters.minPrice || filters.maxPrice) && (
        <div className="active-filters">
          <span>Active filters:</span>
          {filters.category && (
            <div className="filter-tag">
              Category: {filters.category}
            </div>
          )}
          {filters.minPrice && (
            <div className="filter-tag">
              Min Price: ₹{filters.minPrice}
            </div>
          )}
          {filters.maxPrice && (
            <div className="filter-tag">
              Max Price: ₹{filters.maxPrice}
            </div>
          )}
          <button className="reset-filters" onClick={resetFilters}>
            Reset
          </button>
        </div>
      )}

      {/* Products table */}
      <div className="products-container">
        {sortedProducts.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>₹{typeof product.cost === 'number' ? product.cost.toFixed(2) : '0.00'}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="edit-button"
                        onClick={() => openEditModal(product)}
                        aria-label={`Edit ${product.productName}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product._id)}
                        aria-label={`Delete ${product.productName}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  value={newProduct.productName || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={newProduct.category || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  min="0"
                  value={newProduct.quantity || 0}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cost">Price (₹)</label>
                <input
                  type="number"
                  id="cost"
                  min="0"
                  step="0.01"
                  value={newProduct.cost || 0}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleAddProduct}>Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-name">Product Name</label>
                <input
                  type="text"
                  id="edit-name"
                  value={currentProduct.productName || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  value={currentProduct.category || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-quantity">Quantity</label>
                <input
                  type="number"
                  id="edit-quantity"
                  min="0"
                  value={currentProduct.quantity || 0}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-cost">Price (₹)</label>
                <input
                  type="number"
                  id="edit-cost"
                  min="0"
                  step="0.01"
                  value={currentProduct.cost || 0}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, cost: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleEditProduct}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Filter Products</h2>
              <button className="close-button" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="filter-category">Category</label>
                <select
                  id="filter-category"
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="min-price">Min Price (₹)</label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  step="0.01"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="max-price">Max Price (₹)</label>
                <input
                  type="number"
                  id="max-price"
                  min="0"
                  step="0.01"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowFilterModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Sort Products</h2>
              <button className="close-button" onClick={() => setShowSortModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body sort-options">
              <div className="sort-option">
                <input
                  type="radio"
                  id="price-low-high"
                  name="sort"
                  value="price-low-high"
                  checked={sortOption === 'price-low-high'}
                  onChange={() => applySort('price-low-high')}
                />
                <label htmlFor="price-low-high">Price: Low to High</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="price-high-low"
                  name="sort"
                  value="price-high-low"
                  checked={sortOption === 'price-high-low'}
                  onChange={() => applySort('price-high-low')}
                />
                <label htmlFor="price-high-low">Price: High to Low</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="name-a-z"
                  name="sort"
                  value="name-a-z"
                  checked={sortOption === 'name-a-z'}
                  onChange={() => applySort('name-a-z')}
                />
                <label htmlFor="name-a-z">Name: A to Z</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="name-z-a"
                  name="sort"
                  value="name-z-a"
                  checked={sortOption === 'name-z-a'}
                  onChange={() => applySort('name-z-a')}
                />
                <label htmlFor="name-z-a">Name: Z to A</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="quantity-low-high"
                  name="sort"
                  value="quantity-low-high"
                  checked={sortOption === 'quantity-low-high'}
                  onChange={() => applySort('quantity-low-high')}
                />
                <label htmlFor="quantity-low-high">Quantity: Low to High</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="quantity-high-low"
                  name="sort"
                  value="quantity-high-low"
                  checked={sortOption === 'quantity-high-low'}
                  onChange={() => applySort('quantity-high-low')}
                />
                <label htmlFor="quantity-high-low">Quantity: High to Low</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="quantity-high-low"
                  name="sort"
                  value="quantity-high-low"
                  checked={sortOption === "quantity-high-low"}
                  onChange={() => applySort("quantity-high-low")}
                />
                <label htmlFor="quantity-high-low">Quantity: High to Low</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setShowSortModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
