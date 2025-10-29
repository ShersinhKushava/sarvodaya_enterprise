import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function CategorySection() {
  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between mb-5">
              <h2 className="section-title">Category</h2>
              <div className="d-flex align-items-center">
                <a href="#" className="btn-link text-decoration-none">
                  View All Categories →
                </a>
                <div className="swiper-buttons">
                  <button className="swiper-prev btn btn-yellow">❮</button>
                  <button className="swiper-next btn btn-yellow">❯</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={6}
          navigation={{
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
          }}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1200: { slidesPerView: 6 },
          }}
          className="category-carousel"
        >
          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>
           <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>
           <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>
           <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>
           <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>
           <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>
           <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-vegetables-broccoli.png" alt="Category Thumbnail" />
              <h3 className="category-title">Fruits & Veges</h3>
            </a>
          </SwiperSlide>

          <SwiperSlide>
            <a href="index.html" className="nav-link category-item">
              <img src="images/icon-bread-baguette.png" alt="Category Thumbnail" />
              <h3 className="category-title">Breads & Sweets</h3>
            </a>
          </SwiperSlide>

          {/* Add more slides like this */}
        </Swiper>
      </div>
    </section>
  );
}
