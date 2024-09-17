import { useNavigate } from "react-router-dom";
import useProducts from "../../constants/products";
import { Buffer } from "buffer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow,Pagination,Navigation} from "swiper/modules";
const Popular = () => {
  const { products } = useProducts();

  const navigate = useNavigate();
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
      <h2 className="text-2xl mx-0 sm:mx-7 my-3 md:text-3xl font-bold mb-4">
        Popular products
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 smm:grid-cols-2 sm:grid-cols-3 xmd:grid-cols-4 space-y-10 justify-evenly items-center">
          {products
            .filter((item) => item.popular === true)
            .map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <img
                  src={`data:${item.image.contentType};base64,${Buffer.from(
                    item.image.data
                  ).toString("base64")}`}
                  alt="item1"
                  className="w-[10rem] h-[10rem] bg-gray-100 p-5 rounded-full rounded-tr-none"
                />
                <h1 className="font-bold text-xl">{item.name}</h1>
                <h1>{item.explanation}</h1>
                <h1 className="font-bold">Costs RWF {item.price}</h1>
                <button className="bg-yellow-500 p-2 rounded-full px-5">
                  Add to cart
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;
