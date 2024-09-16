import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";
import { CartContext } from "../../../constants/cartItems";
import { FavContext } from "../../../constants/favItems";
import Loader from "../loader";

const MenPants = () => {
  const { loading, products } = useProducts();
  const [Menpants, setMenpants] = useState([]);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);

  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender === "Male" && prod.category === "pants"
    );
    setMenpants(menProducts);
    // if (itemsOnCart || itemsOnCart.length > 0) {
    //   setLocalCart(itemsOnCart.map((item) => item.productId));
    // }
    if (itemsOnCart && itemsOnCart.length > 0) {
      setLocalCart(itemsOnCart.map((item) => item.productId));
    } else {
      setLocalCart([]);
    }
    if (itemsOnFav && itemsOnFav.length > 0) {
      setLocalFav(itemsOnFav.map((items) => items.productId));
    } else {
      setLocalFav([]);
    }
  }, [products, itemsOnCart, itemsOnFav]);

  const handleAddToCart = (pantId) => {
    addItemOncart(pantId);
    setLocalCart([...localCart, pantId]);
  };

  const handleDeleteItem = (pantId) => {
    deleteItem(pantId);
    setLocalCart(localCart.filter((id) => id !== pantId));
  };

  const handleAddToFav = (pantId) => {
    addItemOnFav(pantId);
    setLocalFav([...localFav, pantId]);
  };

  const handleDeleteFromFav = (pantId) => {
    deleteItemFromFav(pantId);
    setLocalFav(localFav.filter((id) => id !== pantId));
  };

  if (loading) {
    return <Loader text="Loading products ..." />;
  }

  return (
    <div>
      {Menpants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Menpants.map((pant) => {
            const isOnCart = localCart.includes(pant._id);
            const isOnFav = localFav.includes(pant._id);

            return (
              <div key={pant._id}>
                <ProductCard
                  itemImage={`data:${
                    pant.image.contentType
                  };base64,${Buffer.from(pant.image.data).toString("base64")}`}
                  itemName={pant.name}
                  itemDesc={pant.description}
                  itemPrice={`RWF ${pant.price}`}
                  handleAddToCart={() => handleAddToCart(pant._id)}
                  deleteItem={() => handleDeleteItem(pant._id)}
                  isOnCart={isOnCart}
                  isOnFav={isOnFav}
                  addToFav={() => handleAddToFav(pant._id)}
                  deleteFromFav={() => handleDeleteFromFav(pant._id)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-black font-bold text-lg flex flex-col items-center justify-center dark:text-white">
          <img
            src="/noData.png"
            alt="No Data"
            className="w-[10rem] h-[10rem] rounded-md my-3"
          />
          <h1>No products available</h1>
        </div>
      )}
    </div>
  );
};

export default MenPants;
