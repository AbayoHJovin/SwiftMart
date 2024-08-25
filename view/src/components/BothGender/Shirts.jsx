import { useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";

const MenShirts = () => {
  const { loading, products } = useProducts();
  const [Shirts, setShirts] = useState([]);
  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender == "Both" && prod.category == "shirts"
    );
    setShirts(menProducts);
  }, [products]);
  if (loading) {
    return <h1>Loading ...</h1>;
  }
  return (
    <div>
      {Shirts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Shirts.map((pant, index) => (
            <div key={index}>
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

export default MenShirts;
