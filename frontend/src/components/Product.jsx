import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductDetailPage from "./productDetailtry";

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
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="col">
      <div className="product-item position-relative">
        {badge && <span className="badge bg-success position-absolute m-3">{badge}</span>}

       

        <figure style={{ height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Link to={`/product/${_id}`}>
            {images && images[0] && (
              <img
                src={`http://localhost:8080/uploads/${images[0]}`}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

const Product = () => {
  const [products, setProducts] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      // Display only 5 latest products (assuming API returns in order)
      setProducts(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="py-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-start mb-4">Latest Product</h3>
            <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
              {products.map(product => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
