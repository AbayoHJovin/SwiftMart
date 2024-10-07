import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { FaStar } from "react-icons/fa";

const Testimonials = [
  {
    Image: "path/to/image1.jpg",
    info: "Great service and fast delivery!",
    Name: "John Doe",
    role: "Verified Buyer",
    rating: 4,
  },
  {
    Image: "path/to/image2.jpg",
    info: "Excellent quality and amazing prices.",
    Name: "Jane Smith",
    role: "Verified Buyer",
    rating: 5,
  },
  {
    Image: "path/to/image1.jpg",
    info: "Great service and fast delivery!",
    Name: "John Doe",
    role: "Verified Buyer",
    rating: 4,
  },
  {
    Image: "path/to/image2.jpg",
    info: "Excellent quality and amazing prices.",
    Name: "Jane Smith",
    role: "Verified Buyer",
    rating: 5,
  },
];

const Review = () => {
  return (
    <div className="relative group my-12 font-roboto text-black dark:text-white bg-white dark:bg-black">
      <div className="text-start md:text-center mb-8">
        <h2 className="text-2xl text-center md:text-3xl font-bold mb-4">
          Customer is our priority
        </h2>
        <p className="text-lg sm:p-5 max-w-auto lg:max-w-5xl p-2 mx-auto">
          At Our shop, we are committed to providing our customers with the best
          online shopping experience. Our customers love the wide range of
          products we offer, from top-quality electronics to trendy fashion
          items, all at unbeatable prices. They appreciate our user-friendly
          interface, which makes browsing and purchasing a breeze. Many have
          praised our fast and reliable shipping, as well as our responsive and
          helpful customer service team. Don&apos;t just take our word for
          it—see what our satisfied customers have to say about their shopping
          experiences with us!
        </p>
      </div>
      <div className="relative font-lato">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          pagination={{
            dynamicMainBullets: true,
            clickable: true,
          }}
          navigation={{ prevEl: "#prev-btn", nextEl: "#next-btn" }}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 5 },
            1440: { slidesPerView: 3, spaceBetween: 5 },
          }}
        >
          {Testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-950 text-black dark:text-white dark:border-r-2 border-gray-100 rounded-lg dark:rounded-none shadow-lg max-w-xs mx-auto"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={item.Image}
                    alt={item.Name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-md font-bold">{item.Name}</h3>
                    <p className="text-gray-600 dark:text-gray-200 text-sm">
                      {item.role}
                    </p>
                  </div>
                </div>
                <h4 className="font-semibold text-md mb-1">
                  Awesome {item.role}
                </h4>
                <p className="text-gray-700 dark:text-gray-200 text-sm mb-3">
                  {item.info}
                </p>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating
                          ? "text-green-500 dark:text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute top-[45%] z-10 w-full group-hover:flex justify-between px-6 hidden">
          <div
            className="bg-slate-200 rounded-full p-2 cursor-pointer"
            id="prev-btn"
          >
            <svg
              className="w-5 h-5"
              fill="#000000"
              viewBox="0 0 256 256"
              id="Flat"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M160,220a11.96287,11.96287,0,0,1-8.48535-3.51465l-80-80a12.00062,12.00062,0,0,1,0-16.9707l80-80a12.0001,12.0001,0,0,1,16.9707,16.9707L96.9707,128l71.51465,71.51465A12,12,0,0,1,160,220Z" />
            </svg>
          </div>
          <div
            className="bg-slate-200 rounded-full p-2 cursor-pointer"
            id="next-btn"
          >
            <svg
              className="w-5 h-5"
              fill="#000000"
              viewBox="0 0 256 256"
              id="Flat"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M96,220a12,12,0,0,1-8.48535-20.48535L159.0293,128,87.51465,56.48535a12.0001,12.0001,0,0,1,16.9707-16.9707l80,80a12.00062,12.00062,0,0,1,0,16.9707l-80,80A11.96287,11.96287,0,0,1,96,220Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
