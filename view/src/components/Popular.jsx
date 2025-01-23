// import { useEffect, useRef, useState } from "react";
// import useProducts from "../../constants/products";
// import Loader3 from "./Loading3";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/autoplay";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const Popular = () => {
//   const { products } = useProducts();
//   const [loading, setLoading] = useState(false);
//   const [popularProducts, setPopularProducts] = useState([]);

//   useEffect(() => {
//     const filterProducts = async () => {
//       setLoading(true);
//       const filteredProducts = await new Promise((resolve) =>
//         setTimeout(
//           () => resolve(products.filter((item) => item.popular === true)),
//           100
//         )
//       );
//       setPopularProducts(filteredProducts);
//       setLoading(false);
//     };

//     filterProducts();
//   }, [products]);

//   const navigateToProduct = (productId) => {
//     window.location.href = `/product/${productId}`;
//   };
//   const prevRef = useRef(null); // Ref for previous button
//   const nextRef = useRef(null); // Ref
//   return (
//     <div className="text-black dark:text-white font-roboto p-2 sm:p-5 my-12 mx-0 sm:mx-5">
//       <div className="text-[20px] ssm:text-[30px] text-start sssm:text-center sm:text-[3rem] space-y-2 font-extrabold mb-4">
//         <h1>Find innovations</h1>
//         <h1>Only here</h1>
//       </div>
//       <div className="text-start sssm:text-center">
//         <h1>Our goal is to supply all new collections</h1>
//         <h1> in fashion to you</h1>
//         <button
//           onClick={() => (window.location.href = "/shop/Unisex/pants")}
//           className="bg-green-900 text-white my-2 p-3 px-5 rounded-md"
//         >
//           Shop Now
//         </button>
//       </div>
//       <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-2 sm:px-5 my-5">
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
//           Popular products
//         </h2>
//         <div className="flex space-x-2">
//           <div
//             ref={prevRef}
//             className=" cursor-pointer bg-green-700 p-2 rounded-full text-white flex justify-center items-center"
//           >
//             <FaChevronLeft className="w-6 h-6" />
//           </div>
//           <div
//             ref={nextRef}
//             className=" cursor-pointer bg-green-700 p-2 rounded-full text-white flex justify-center items-center"
//           >
//             <FaChevronRight className="w-6 h-6" />
//           </div>
//         </div>
//       </div>

//       {loading || popularProducts.length === 0 ? (
//         <div className="flex justify-center items-center text-center w-full h-[300px]">
//           <Loader3 />
//         </div>
//       ) : (
//         <div className="relative">
//           <Swiper
//             spaceBetween={10}
//             slidesPerView={1} // one slide at a time for mobile
//             breakpoints={{
//               640: { slidesPerView: 1 }, // mobile view: show 1 product
//               768: { slidesPerView: 2, spaceBetween: 15 }, // tablet: show 2 products
//               1024: { slidesPerView: 3, spaceBetween: 20 }, // desktop: 3 products
//               1280: { slidesPerView: 4, spaceBetween: 20 }, // large desktop: 4 products
//             }}
//             loop={true} // infinite loop
//             navigation={{
//               prevEl: prevRef.current,
//               nextEl: nextRef.current,
//             }}
//             autoplay={{
//               delay: 2500,
//               disableOnInteraction: true,
//             }}
//             onSwiper={(swiper) => {
//               if (!swiper.navigation.initialized) {
//                 swiper.params.navigation.prevEl = prevRef.current;
//                 swiper.params.navigation.nextEl = nextRef.current;
//                 swiper.navigation.init();
//                 swiper.navigation.update();
//               }
//             }}

//             onMouseEnter={(swiper) => swiper.autoplay.stop()}
//             onMouseLeave={(swiper) => swiper.autoplay.start()}
//             onClick={(swiper) => swiper.autoplay.stop()} // stop autoplay when clicked
//             modules={[Navigation, Autoplay]}
//           >
//             {popularProducts.map((item) => (
//               <SwiperSlide key={item.prodId}>
//                 <div className="flex justify-center items-center w-full max-w-[300px] h-[350px] sm:h-[400px] bg-gray-100 rounded-md cursor-pointer relative group mx-auto">
//                   <img
//                     src={item.image}
//                     alt="item"
//                     className="w-full h-full object-cover rounded-md"
//                   />
//                   <div className="absolute inset-0 bg-green-50 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <button
//                     onClick={() => navigateToProduct(item.prodId)}
//                     className="absolute bottom-0 w-full bg-green-600 text-white py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                   >
//                     View Product
//                   </button>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Popular;

import { useEffect, useRef, useState } from "react";
import useProducts from "../../constants/products";
import Loader3 from "./Loading3";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Popular = () => {
  const { products } = useProducts();
  const [loading, setLoading] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filterProducts = async () => {
      setLoading(true);
      try {
        const filteredProducts = products.filter(
          (item) => item.popular === true
        );
        setPopularProducts(filteredProducts);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (products) {
      filterProducts();
    }
  }, [products]);

  return (
    <div className="text-black dark:text-white font-roboto p-2 sm:p-5 my-12 mx-0 sm:mx-5">
      <div className="text-[20px] ssm:text-[30px] text-start sssm:text-center sm:text-[3rem] space-y-2 font-extrabold mb-4">
        <h1>Find innovations</h1>
        <h1>Only here</h1>
      </div>
      <div className="text-start sssm:text-center">
        <h1>Our goal is to supply all new collections in fashion to you</h1>
        <button
          onClick={() => navigate("/shop/Unisex/pants")}
          className="bg-green-900 text-white my-2 p-3 px-5 rounded-md"
        >
          Shop Now
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-2 sm:px-5 my-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Popular products
        </h2>
        <div className="flex space-x-2">
          <div
            ref={prevRef}
            className="cursor-pointer bg-green-700 p-2 rounded-full text-white flex justify-center items-center"
          >
            <FaChevronLeft className="w-6 h-6" />
          </div>
          <div
            ref={nextRef}
            className="cursor-pointer bg-green-700 p-2 rounded-full text-white flex justify-center items-center"
          >
            <FaChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {loading || popularProducts.length === 0 ? (
        <div className="flex justify-center items-center text-center w-full h-[300px]">
          <Loader3 />
        </div>
      ) : (
        <div className="relative">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
            loop={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            onSwiper={(swiper) => {
              if (!swiper.navigation.initialized) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            onMouseEnter={(swiper) => swiper.autoplay.stop()}
            onMouseLeave={(swiper) => swiper.autoplay.start()}
            modules={[Navigation, Autoplay]}
          >
            {popularProducts.map((item) => (
              <SwiperSlide key={item.prodId}>
                <div className="flex justify-center items-center w-full max-w-[300px] h-[350px] sm:h-[400px] bg-gray-100 rounded-md cursor-pointer relative group mx-auto">
                  <img
                    src={item.image}
                    alt="item"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-green-50 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => navigate(`/product/${item.prodId}`)}
                    className="absolute bottom-0 w-full bg-green-600 text-white py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    View Product
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Popular;
