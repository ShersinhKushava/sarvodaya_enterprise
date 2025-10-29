import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap';

const AddProduct = ({ toggleSidebar, isOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    afterDiscountPrice: '',
    description: '',
    category: '',
    images: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://sarvodaya-enterprise.onrender.com/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://sarvodaya-enterprise.onrender.com/api/admin/getCatgory');
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    setFormData({
      name: product ? product.name : '',
      price: product ? product.price : '',
      afterDiscountPrice: product ? product.afterDiscountPrice : '',
      description: product ? product.description : '',
      category: product ? product.category : '',
      images: []
    });
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      afterDiscountPrice: '',
      description: '',
      category: '',
      images: []
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.afterDiscountPrice || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('afterDiscountPrice', formData.afterDiscountPrice);
      data.append('description', formData.description);
      data.append('category', formData.category);
      for (let i = 0; i < formData.images.length; i++) {
        data.append('images', formData.images[i]);
      }

      if (editingProduct) {
        await axios.put(`https://sarvodaya-enterprise.onrender.com/api/products/${editingProduct._id}`, data);
      } else {
        await axios.post('https://sarvodaya-enterprise.onrender.com/api/products', data);
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`https://sarvodaya-enterprise.onrender.com/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  return (
    <div className={`content ${isOpen ? 'open' : ''}`}>
      <div className="bg-light rounded p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Manage Products</h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>After Discount</th>
              <th>Description</th>
              <th>Category</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>${product.afterDiscountPrice}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>
                    {product.images && product.images.map((img, i) => (
                      <img
                        key={i}
                        src={`https://sarvodaya-enterprise.onrender.com/uploads/${img}`}
                        alt={product.name}
                        width="50"
                        height="50"
                        className="me-1"
                        style={{ objectFit: 'cover' }}
                      />
                    ))}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>After Discount Price *</Form.Label>
              <Form.Control
                type="number"
                name="afterDiscountPrice"
                placeholder="Enter discounted price"
                value={formData.afterDiscountPrice}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                name="images"
                multiple
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Select multiple images for the product
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default AddProduct;
