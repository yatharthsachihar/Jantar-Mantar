import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { mediaUrl } from '../api/axios';

export default function BannerCarousel({ banners = [] }) {
  if (!banners.length) return null;
  return (
    <div className="sh-carousel">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={banners.length > 1}
        spaceBetween={0}
        slidesPerView={1}
      >
        {banners.map((b) => (
          <SwiperSlide key={b._id}>
            <Link to={b.link || '/shop'} className="sh-slide">
              <img src={mediaUrl(b.image) || 'https://placehold.co/1200x420?text=Banner'} alt={b.title} />
              <div className="sh-slide-text">
                {b.badge && <span className="tag green">{b.badge}</span>}
                <h2>{b.title}</h2>
                {b.subtitle && <p>{b.subtitle}</p>}
                <span className="btn btn-primary">{b.ctaText || 'Shop Now'}</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
