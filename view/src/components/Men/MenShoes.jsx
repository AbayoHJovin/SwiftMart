import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { CartContext } from "../../../constants/cartItems";
import { FavContext } from "../../../constants/favItems";
import Loader from "../loader";
import { Pagination, Stack } from "@mui/material";

const MenShoes = () => {
  const { loading, products } = useProducts();
  const [Menshoes, setMenshoes] = useState([]);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Menshoes.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(Menshoes.length / productsPerPage);
  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender == "Male" && prod.category == "shoes" ||
      (prod.gender === "Unisex" && prod.category === "shoes")

    );
    setMenshoes(menProducts);

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

  const handleAddToCart = (shoeId) => {
    addItemOncart(shoeId);
    setLocalCart([...localCart, shoeId]);
  };

  const handleDeleteItem = (shoeId) => {
    deleteItem(shoeId);
    setLocalCart(localCart.filter((id) => id !== shoeId));
  };

  const handleAddToFav = (shoeId) => {
    addItemOnFav(shoeId);
    setLocalFav([...localFav, shoeId]);
  };

  const handleDeleteFromFav = (shoeId) => {
    deleteItemFromFav(shoeId);
    setLocalFav(localFav.filter((id) => id !== shoeId));
  };
  function handlePageChange(event, pageNumber) {
    setCurrentPage(pageNumber);
  }
  if (loading) {
    return <Loader text="Loading products ..." />;
  }

  return (
    <div>
      {Menshoes.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((shoe) => {
              const isOnCart = localCart.includes(shoe.prodId);
              const isOnFav = localFav.includes(shoe.prodId);

              return (
                <div key={shoe.prodId}>
                  <ProductCard
                    itemImage={shoe.image}
                    itemName={shoe.prodName}
                    itemDesc={shoe.prodDescription}
                    itemPrice={`RWF ${shoe.price}`}
                    handleAddToCart={() => handleAddToCart(shoe.prodId)}
                    deleteItem={() => handleDeleteItem(shoe.prodId)}
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={() => handleAddToFav(shoe.prodId)}
                    deleteFromFav={() => handleDeleteFromFav(shoe.prodId)}
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
        <svg
          className="w-24 h-24 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1>No products available</h1>
      </div>
      )}
    </div>
  );
};

export default MenShoes;
