import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  const { _id, name, price, afterDiscountPrice, description, category, images, badge } = product;
  const UserData = JSON.parse(localStorage.getItem("userData"));


  // Local state for quantity
  const [quantity, setQuantity] = useState(1);

  const AddtoCart = async () => {
   console.log(UserData);
    if (!UserData) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const mergedData = {
      userId: UserData.id,
      userName: UserData.name,
      userPhone: UserData.mobile,
      userEmail: UserData.email,
      userAddress: UserData.address,
      productId: _id,
      name,
      price,
      afterDiscountPrice,
      description,
      category,
      images,
      quantity
    };
    console.log(mergedData);
    try {
      const res = await axios.post("http://localhost:8080/api/cart", mergedData);
      alert("Product added to cart successfully!");
      
    } catch (err) {
     
     
    }
  };

  return (
    <div className="col">
      <div className="product-item position-relative">
        {badge && <span className="badge bg-success position-absolute m-3">{badge}</span>}


        <figure>
          <Link to={`/product/${_id}`}>
            {images && images[0] && (
              <img
                src={`http://localhost:8080/uploads/${images[0]}`}
                alt={name}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Link>
        </figure>

        <h3>{name}</h3>
        <span className="price d-block mt-2">
          Rs.{afterDiscountPrice} <del className="text-muted">Rs.{price}</del>
        </span>
        <p>{description}</p>

        <div className="d-flex align-items-center justify-content-between mt-3">
          <div className="input-group product-qty" style={{ maxWidth: "120px" }}>
            <button
              type="button"
              className="quantity-left-minus btn btn-danger btn-number"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
            >
              <svg width={16} height={16}>
                <use xlinkHref="#minus" />
              </svg>
            </button>

            <input
              type="text"
              className="form-control input-number text-center"
              value={quantity}
              onChange={e => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) setQuantity(val);
              }}
            />

            <button
              type="button"
              className="quantity-right-plus btn btn-success btn-number"
              aria-label="Increase quantity"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              <svg width={16} height={16}>
                <use xlinkHref="#plus" />
              </svg>
            </button>
          </div>

          <button onClick={AddtoCart} className="nav-link d-flex align-items-center">
            Add to Cart <iconify-icon icon="uil:shopping-cart" className="ms-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Producttry = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tabs, setTabs] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      // Display only 5 latest products (assuming API returns in order)
      setProducts(res.data);
    } catch (err) {

    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/getCatgory");
      setCategories(res.data);
    } catch (err) {

    }
  };

  // Organize products by category
  const organizeTabs = () => {
    const allTab = { id: "nav-all", label: "All", products: products };
    const categoryTabs = categories.map((cat, idx) => ({
      id: `nav-${cat.name || cat}-${idx}`,
      label: cat.name || cat,
      products: products.filter(p => p.category === (cat.name || cat))
    }));
    setTabs([allTab, ...categoryTabs]);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products.length && categories.length) {
      organizeTabs();
    }
  }, [products, categories]);

  return (
    <section className="py-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="bootstrap-tabs product-tabs">
              <div className="tabs-header d-flex justify-content-between border-bottom my-5">
                <h3>Our Best Product</h3>
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    {tabs.map((tab, index) => (
                      <a
                        key={tab.id}
                        href="#"
                        className={`nav-link text-uppercase fs-6 ${index === 0 ? "active" : ""}`}
                        id={`${tab.id}-tab`}
                        data-bs-toggle="tab"
                        data-bs-target={`#${tab.id}`}
                        role="tab"
                        aria-controls={tab.id}
                        aria-selected={index === 0}
                      >
                        {tab.label}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>

              <div className="tab-content" id="nav-tabContent">
                {tabs.map((tab, index) => (
                  <div
                    key={tab.id}
                    className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                    id={tab.id}
                    role="tabpanel"
                    aria-labelledby={`${tab.id}-tab`}
                  >
                    <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                      {tab.products.map(product => (
                        <ProductItem key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Producttry;
