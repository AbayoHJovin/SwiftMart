import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Pagination, Stack } from "@mui/material";
import Loader3 from "../Loading3";
import { ThemeContext } from "../../../constants/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FavContext } from "../../../constants/favItems";
import { CartContext } from "../../../constants/cartItems";

const MenShirts = () => {
  const { loading, products } = useProducts();
  const [Menpants, setMenpants] = useState([]);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Menpants.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const totalPages = Math.ceil(Menpants.length / productsPerPage);

  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender == "Unisex" && prod.category == "shirts"
    );
    setMenpants(menProducts);

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

  const handleAddToCart = (pantId, event) => {
    event.stopPropagation();
    addItemOncart(pantId);
    setLocalCart([...localCart, pantId]);
  };

  const handleDeleteItem = (pantId, event) => {
    event.stopPropagation();
    deleteItem(pantId);
    setLocalCart(localCart.filter((id) => id !== pantId));
  };

  const handleAddToFav = (pantId, event) => {
    // event.stopPropagation();
    addItemOnFav(pantId);
    setLocalFav([...localFav, pantId]);
  };

  const handleDeleteFromFav = (pantId, event) => {
    event.stopPropagation();
    deleteItemFromFav(pantId);
    setLocalFav(localFav.filter((id) => id !== pantId));
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function showProduct(itemId) {
    navigate(`/product/${itemId}`);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader3 />
      </div>
    );
  }

  return (
    <div>
      {Menpants.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((pant) => {
              const isOnCart = localCart.includes(pant.prodId);
              const isOnFav = localFav.includes(pant.prodId);

              return (
                <div key={pant.prodId} onClick={() => showProduct(pant.prodId)}>
                  <ProductCard
                    itemImage={pant.image}
                    itemName={pant.prodName}
                    itemDesc={pant.prodDescription}
                    itemPrice={`RWF ${pant.price}`}
                    handleAddToCart={(event) =>
                      handleAddToCart(pant.prodId, event)
                    }
                    deleteItem={(event) => handleDeleteItem(pant.prodId, event)}
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={() => handleAddToFav(pant.prodId)}
                    deleteFromFav={(event) =>
                      handleDeleteFromFav(pant.prodId, event)
                    }
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center">
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
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme == "dark" ? "#fff" : "#000",
                      borderColor: theme == "dark" ? "#fff" : "#000",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: theme == "dark" ? "#fff" : "#000",
                      color: theme == "dark" ? "#000" : "#fff",
                    },
                    "& .MuiPaginationItem-ellipsis": {
                      color: theme == "dark" ? "#fff" : "#000",
                    },
                  }}
                />
              </Stack>
            </div>
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

export default MenShirts;
