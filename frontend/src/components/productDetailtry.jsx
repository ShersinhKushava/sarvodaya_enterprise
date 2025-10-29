import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const UserData = JSON.parse(localStorage.getItem("userData"));

  const addtocart = async ()=>{
    if (!UserData) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const mergedData = {
      userId: UserData.id,
      userName: UserData.name,
      userPhone: UserData.phone,
      userEmail: UserData.email,
      userAddress: UserData.address,
      productId: id,
      name: product.name,
      price: product.price,
      afterDiscountPrice: product.afterDiscountPrice,
      description: product.description,
      category: product.category,
      images: product.images,
      quantity
    };

    try {
      const res = await axios.post("https://sarvodaya-enterprise.onrender.com/api/cart", mergedData);
      alert("Product added to cart successfully!");
      // Dispatch custom event to update cart in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart.");
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://sarvodaya-enterprise.onrender.com/api/products/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.images[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (imge) => {
    if (!imge) return "";
    return `https://sarvodaya-enterprise.onrender.com/uploads/${imge}`;
  };

  if (loading) return <p className="text-center mt-5">Loading product...</p>;
  if (!product) return <p className="text-center mt-5">Product not found.</p>;

  return (
    <section className="py-5">
      <div className="container-fluid">
        <div className="row">
          {/* Left: Images */}
          <div className="col-md-6 mb-4">
            <div
              className="mb-3 text-center shadow-sm"
              style={{
                width: "100%",
                height: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
              }}
            >
              <img
                src={getImageUrl(mainImage)}
                alt={product.name}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className="img-thumbnail"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: mainImage === img ? "2px solid #007bff" : "1px solid #ddd",
                  }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="col-md-6">
            <h2 className="mb-3">{product.name}</h2>
            <h4 style={{ color: "black" }}  >Rs.{product.afterDiscountPrice.toFixed(2)}</h4>
            <h6 className="text-muted mb-3">
              <del>Rs.{product.price.toFixed(2)}</del>
            </h6>
            <p>{product.description}</p>

            {/* Quantity Selector */}
            <div className="d-flex align-items-center mt-4 mb-3">
              <label className="me-3 fw-bold">Quantity:</label>
              <div className="input-group" style={{ maxWidth: "150px" }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setQuantity(val);
                  }}
                  min="1"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4 flex-wrap">
              <button className="btn btn-primary" onClick={addtocart}>Add to Cart</button>
              <button className="btn btn-outline-secondary" onClick={addtocart}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
