import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../constants/products";
import { Buffer } from "buffer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Loader3 from "./Loading3";

const Popular = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const swiperRef = useRef(null);
  useEffect(() => {
    const filterProducts = async () => {
      setLoading(true);
      const filteredProducts = await new Promise((resolve) =>
        setTimeout(
          () => resolve(products.filter((item) => item.popular === true)),
          100
        )
      );
      setPopularProducts(filteredProducts);
      setLoading(false);
    };

    filterProducts();
  }, [products]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.update();
    }
  }, []);

  return (
    <div className="text-black dark:text-white font-lato p-2 sm:p-5 my-12 mx-0 sm:mx-5">
      <div className="text-[20px] ssm:text-[30px] text-start sssm:text-center sm:text-[3rem] space-y-2 font-extrabold mb-4">
        <h1>Find innovations</h1>
        <h1>Only here</h1>
      </div>
      <div className="text-start sssm:text-center">
        <h1>Our goal is to supply all new collections</h1>
        <h1> in fashion to you</h1>
        <button
          onClick={() => navigate("/shop")}
          className="bg-green-900 text-white my-2 p-3 px-5 rounded-md"
        >
          Shop Now
        </button>
      </div>

      <h2 className="text-2xl mx-0 sm:mx-7 my-3 md:text-3xl font-bold mb-4 text-center">
        Popular products
      </h2>

      <div className="relative flex justify-center items-center space-y-4 p-4">
        <Swiper
          ref={swiperRef}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 20,
            depth: 100,
            modifier: 2.5,
          }}
          slidesPerView={"auto"}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".nextbtn",
            prevEl: ".prevbtn",
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1440: { slidesPerView: 4, spaceBetween: 25 },
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
        >
          {loading || popularProducts.length === 0 ? (
            <Loader3 />
          ) : (
            popularProducts.map((item) => (
              <SwiperSlide
                key={item._id}
                style={{ width: "15rem", height: "15rem" }}
                className="flex bg-gray-100 rounded-md justify-center"
              >
                <div className="w-full h-full bg-blue-60 rounded-md">
                  <img
                    src={`data:${item.image.contentType};base64,${Buffer.from(
                      item.image.data
                    ).toString("base64")}`}
                    alt="item"
                    className="w-full h-full rounded-md"
                  />
                </div>
              </SwiperSlide>
            ))
          )}

          <div className="my-5">
            <div className="flex content-center items-center justify-center gap-24">
              <div className="prevbtn cursor-pointer z-20">
                <ArrowLeft className="arrow-back cursor-pointer" />
              </div>
              <div className="swiper-pagination z-20"></div>
              <div className="nextbtn cursor-pointer z-20">
                <ArrowRight className="arrow-next cursor-pointer" />
              </div>
            </div>
          </div>
        </Swiper>

        <div className="swiper-pagination absolute bottom-0 w-full text-center"></div>
      </div>
    </div>
  );
};

export default Popular;
