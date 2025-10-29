import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import RecentSales from './components/RecentSales';
import CompletedSales from './components/CompletedSales';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AddBlog from './components/AddBlog';
import ManageBlogs from './components/ManageBlogs';
import ManageAdmins from './components/ManageAdmins';
import AddCategory from './components/AddCategory';
import AddProduct from './components/AddProduct';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Initialize jQuery-based features after React renders
    const initFeatures = () => {


      // Back to top button
      $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
          $('.back-to-top').fadeIn('slow');
        } else {
          $('.back-to-top').fadeOut('slow');
        }
      });
      $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
      });




    };

    // Delay initialization to ensure DOM is ready
    setTimeout(initFeatures, 100);

    // Cleanup
    return () => {
      $(window).off('scroll');
      $('.back-to-top').off('click');
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              {/* Spinner Start */}
              {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div> */}
              {/* Spinner End */}

              <Sidebar isOpen={isSidebarOpen} />
              <Content toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recent-sales"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <RecentSales toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/completed-sales"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <CompletedSales toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-blog"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <AddBlog toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-blogs"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <ManageBlogs toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-admins"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <ManageAdmins toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-category"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <AddCategory toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <div className="container-xxl position-relative bg-white d-flex p-0">
              <Sidebar isOpen={isSidebarOpen} />
              <AddProduct toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

              {/* Back to Top */}
              <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
