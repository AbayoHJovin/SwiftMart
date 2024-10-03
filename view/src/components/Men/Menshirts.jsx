import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";
import { CartContext } from "../../../constants/cartItems";
import { FavContext } from "../../../constants/favItems";
import Loader from "../loader";
import { Pagination, Stack } from "@mui/material";

const MenShirts = () => {
  const { loading, products } = useProducts();
  const [Menshirts, setMenshirts] = useState([]);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Menshirts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(Menshirts.length / productsPerPage);
  useEffect(() => {
    const menProducts = products.filter(
      (prod) =>
        (prod.gender === "Male" && prod.category === "shirts") ||
        (prod.gender === "Both" && prod.category === "shirts")
    );

    setMenshirts(menProducts);

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

  const handleAddToCart = (shirtId) => {
    addItemOncart(shirtId);
    setLocalCart([...localCart, shirtId]);
  };

  const handleDeleteItem = (shirtId) => {
    deleteItem(shirtId);
    setLocalCart(localCart.filter((id) => id !== shirtId));
  };

  const handleAddToFav = (shirtId) => {
    addItemOnFav(shirtId);
    setLocalFav([...localFav, shirtId]);
  };

  const handleDeleteFromFav = (shirtId) => {
    deleteItemFromFav(shirtId);
    setLocalFav(localFav.filter((id) => id !== shirtId));
  };
  function handlePageChange(event, pageNumber) {
    setCurrentPage(pageNumber);
  }
  if (loading) {
    return <Loader text="Loading products ..." />;
  }

  return (
    <div>
      {Menshirts.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((shirt) => {
              const isOnCart = localCart.includes(shirt._id);
              const isOnFav = localFav.includes(shirt._id);

              return (
                <div key={shirt._id}>
                  <ProductCard
                    itemImage={`data:${
                      shirt.image.contentType
                    };base64,${Buffer.from(shirt.image.data).toString(
                      "base64"
                    )}`}
                    itemName={shirt.name}
                    itemDesc={shirt.description}
                    itemPrice={`RWF ${shirt.price}`}
                    handleAddToCart={() => handleAddToCart(shirt._id)}
                    deleteItem={() => handleDeleteItem(shirt._id)}
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={() => handleAddToFav(shirt._id)}
                    deleteFromFav={() => handleDeleteFromFav(shirt._id)}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center">
            <Stack spacing={2} className="mt-5">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="circular"
                siblingCount={1}
                boundaryCount={2}
              />
            </Stack>
          </div>
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

export default MenShirts;
