import React from 'react'

const AboutUs = () => {
return (
    <div className="container-fluid py-5">
      {/* Hero Section */}
      <div className="bg-light shadow-sm py-5 mb-5">
        <h1 className="text-center display-4 fw-bold text-dark">
          About Us
        </h1>
        <p className="text-center text-muted mt-3 fs-5" style={{maxWidth: '600px', margin: '0 auto'}}>
          Welcome to our store! We are a new seller passionate about delivering high-quality products and a great shopping experience.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
            alt="Our Story"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-lg-6">
          <h2 className="display-5 fw-semibold text-dark mb-4">Our Story</h2>
          <p className="text-muted fs-5 mb-4">
            We started our journey as a new seller with a simple mission: to bring high-quality products and joy to every customer. Each product is carefully selected to meet our standards and provide the best value.
          </p>
          <p className="text-muted fs-5">
            Even as a small new store, we are committed to excellent service, fast shipping, and building trust with our customers. Your satisfaction is our top priority.
          </p>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-light py-5 mb-5">
        <h2 className="text-center display-5 fw-semibold text-dark mb-5">Our Values</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="card-title h4 fw-semibold text-dark mb-3">Quality Products</h3>
                <p className="card-text text-muted">Every product is carefully selected to ensure top quality and value for our customers.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="card-title h4 fw-semibold text-dark mb-3">Customer Satisfaction</h3>
                <p className="card-text text-muted">Your happiness matters most. We strive for excellent service and fast responses.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="card-title h4 fw-semibold text-dark mb-3">Trust & Transparency</h3>
                <p className="card-text text-muted">We believe in honesty, clear communication, and building lasting relationships with our customers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="text-center py-5">
        <h2 className="display-5 fw-semibold text-dark mb-4">Thank You for Supporting Us!</h2>
        <p className="text-muted fs-5" style={{maxWidth: '600px', margin: '0 auto'}}>
          We're excited to grow and serve you with the best products and service. Your support helps small sellers like us thrive!
        </p>
      </div>
    </div>
  );
}

export default AboutUs
