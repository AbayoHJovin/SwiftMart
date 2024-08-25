import { useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

const Hats = () => {
  const { loading, products } = useProducts();
  const [hats, sethats] = useState([]);
  const navigate=useNavigate()

  function handleProdClick(item) {
    navigate(`/product/${item._id}`)
  }
  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender == "Both" && prod.category == "hats"
    );
    sethats(menProducts);
  }, [products]);
  if (loading) {
    return <h1>Loading ...</h1>;
  }
  return (
    <div>
      {hats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {hats.map((pant, index) => (
            <div
              key={index}
              onClick={() => handleProdClick(pant)}
              className="cursor-pointer"
            >
              <ProductCard
                itemImage={`data:${pant.image.contentType};base64,${Buffer.from(
                  pant.image.data
                ).toString("base64")}`}
                itemName={pant.name}
                itemDesc={pant.description}
                itemPrice={`$${pant.price}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-black font-bold text-lg flex flex-col items-center justify-center dark:text-white">
          <img
            src="/noData.png"
            alt="No Data"
            className="w-[10rem] h-[10rem] rounded-md my-3"
          />
          <h1> No products available</h1>
        </div>
      )}
    </div>
  );
};

export default Hats;
