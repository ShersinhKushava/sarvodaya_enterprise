import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Required for offcanvas
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Header from "./components/Header";

import Product from "./components/Product";
import Blogs from "./components/Blogs";
import BlogsPage from "./components/BlogsPage";

import Ouroffer from "./components/Ouroffer";
import Footer from "./components/Footer";
import Caurasal from "./components/Caurasal";

import Login from "./components/Login";


import Producttry from "./components/TryProduct";

import ProductDetailWithFixedMainImage from "./components/productDetailtry";
import ProductDetailPage from "./components/productDetailtry";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Headerq from "./components/tryheader";
import Checkout from "./components/Checkout";
import OrderStatus from "./components/OrderStatus";
import { CategoryProvider } from "./CategoryContext";


// ✅ ProtectedRoute Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("Admintoken"); // token stored after login
  return token ? children : <Navigate to="/login" />;
}

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Caurasal />
          <Product />
          <Producttry />

          <Blogs />
          <Ouroffer />
          <Footer />
        </>
      ),
    },
    {
      path: "/product",
      element: (
        <>
          <Header />

          <Producttry />

          <Footer />
        </>
      ),
    },
    // Product detail page (dynamic)
    {
      path: "/product/:id",
      element: (
        <>
          <Header />
          <ProductDetailPage />
          <Producttry />

          <Footer />
        </>
      ),
    },
    {
      path: "/blogs",
      element: (
        <>
          <Header />
          <BlogsPage />
          <Footer />
        </>
      ),
    },
    {
      path: "/blogs/:id",
      element: (
        <>
          <Header />
          <BlogsPage />
          <Footer />
        </>
      ),
    },
    {
      path: "/About-us",
      element: (
        <>
          <Header />
          <AboutUs />
          <Footer />
        </>
      ),
    },
    {
      path: "/he",
      element: (
        <>
          <Headerq />
        </>
      ),
    },
    {
      path: "/checkout",
      element: (
        <>
          <Header />
          <Checkout />
          <Producttry />
          <Blogs />
          <Footer />
        </>
      ),
    },
    {
      path: "/order-status",
      element: (
        <>
          <Header />
          <OrderStatus />
          <Product />
          <Blogs />
          <Footer />
        </>
      ),
    },
    {
      path: "/About-Us",
      element: (
        <>
          <Header />
          <AboutUs />
          <Blogs />
          <Footer />
        </>
      ),
    },
    {
      path: "/contact-us",
      element: (
        <>
          <Header />
          <ContactUs />
          <Blogs />
          <Footer />
        </>
      ),
    },
  ]);

  return (
    <CategoryProvider>
      <RouterProvider router={router} />
    </CategoryProvider>
  );
}

export default App;
