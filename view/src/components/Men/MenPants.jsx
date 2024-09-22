// import { useContext, useEffect, useState } from "react";
// import useProducts from "../../../constants/products";
// import ProductCard from "../Product";
// import { Buffer } from "buffer";
// import { CartContext } from "../../../constants/cartItems";
// import { FavContext } from "../../../constants/favItems";
// import Loader from "../loader";
// import { Pagination, Stack } from "@mui/material";
// import { ThemeContext } from "@emotion/react";
// import { useNavigate } from "react-router-dom";

// const MenPants = () => {
//   const { loading, products } = useProducts();
//   const [Menpants, setMenpants] = useState([]);
//   const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
//   const [localCart, setLocalCart] = useState([]);
//   const [localFav, setLocalFav] = useState([]);
//   const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
//     useContext(FavContext);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 12;

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = Menpants.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const navigate=useNavigate()
//   const { theme } = useContext(ThemeContext);
//   // Calculate total pages
//   const totalPages = Math.ceil(Menpants.length / productsPerPage);

//   useEffect(() => {
//     const menProducts = products.filter(
//       (prod) => prod.gender === "Male" && prod.category === "pants"
//     );
//     setMenpants(menProducts);

//     if (itemsOnCart && itemsOnCart.length > 0) {
//       setLocalCart(itemsOnCart.map((item) => item.productId));
//     } else {
//       setLocalCart([]);
//     }
//     if (itemsOnFav && itemsOnFav.length > 0) {
//       setLocalFav(itemsOnFav.map((items) => items.productId));
//     } else {
//       setLocalFav([]);
//     }
//   }, [products, itemsOnCart, itemsOnFav]);

//   const handleAddToCart = (pantId,event) => {
//     event.stopPropagation()
//     addItemOncart(pantId);
//     setLocalCart([...localCart, pantId]);
//   };

//   const handleDeleteItem = (pantId) => {
//     deleteItem(pantId);
//     setLocalCart(localCart.filter((id) => id !== pantId));
//   };

//   const handleAddToFav = (pantId) => {
//     addItemOnFav(pantId);
//     setLocalFav([...localFav, pantId]);
//   };

//   const handleDeleteFromFav = (pantId) => {
//     deleteItemFromFav(pantId);
//     setLocalFav(localFav.filter((id) => id !== pantId));
//   };
//   const handlePageChange = (event, pageNumber) => {
//     setCurrentPage(pageNumber);
//   };
// function showProduct(itemId){
// navigate(`/product/${itemId}`)
// }
//   if (loading) {
//     return <Loader text="Loading products ..." />;
//   }

//   return (
//     <div>
//       {Menpants.length > 0 ? (
//         <div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {currentProducts.map((pant) => {
//               const isOnCart = localCart.includes(pant._id);
//               const isOnFav = localFav.includes(pant._id);

//               return (
//                 <div key={pant._id} onClick={()=>showProduct(pant._id)}>
//                   <ProductCard
//                     itemImage={`data:${
//                       pant.image.contentType
//                     };base64,${Buffer.from(pant.image.data).toString(
//                       "base64"
//                     )}`}
//                     itemName={pant.name}
//                     itemDesc={pant.description}
//                     itemPrice={`RWF ${pant.price}`}
//                     handleAddToCart={() => handleAddToCart(pant._id)}
//                     deleteItem={() => handleDeleteItem(pant._id)}
//                     isOnCart={isOnCart}
//                     isOnFav={isOnFav}
//                     addToFav={() => handleAddToFav(pant._id)}
//                     deleteFromFav={() => handleDeleteFromFav(pant._id)}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//           <div className="flex justify-center items-center">
//             <div className="flex justify-center items-center">
//               <Stack spacing={2} className="mt-5">
//                 <Pagination
//                   count={totalPages}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   variant="outlined"
//                   shape="circular"
//                   siblingCount={1}
//                   boundaryCount={2}
//                   sx={{
//                     "& .MuiPaginationItem-root": {
//                       color: theme == "dark" ? "#fff" : "#000",
//                       borderColor: theme == "dark" ? "#fff" : "#000",
//                     },
//                     "& .MuiPaginationItem-root.Mui-selected": {
//                       backgroundColor: theme == "dark" ? "#fff" : "#000",
//                       color: theme == "dark" ? "#000" : "#fff",
//                     },
//                     "& .MuiPaginationItem-ellipsis": {
//                       color: theme == "dark" ? "#fff" : "#000",
//                     },
//                   }}
//                 />
//               </Stack>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="text-black font-bold text-lg flex flex-col items-center justify-center dark:text-white">
//           <img
//             src="/noData.png"
//             alt="No Data"
//             className="w-[10rem] h-[10rem] rounded-md my-3"
//           />
//           <h1>No products available</h1>
//         </div>
//       )}
//     </div>
//   );
// };
// export default MenPants;

import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";
import { CartContext } from "../../../constants/cartItems";
import { FavContext } from "../../../constants/favItems";
import Loader from "../loader";
import { Pagination, Stack } from "@mui/material";
import { ThemeContext } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const MenPants = () => {
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

  // Calculate total pages
  const totalPages = Math.ceil(Menpants.length / productsPerPage);

  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender === "Male" && prod.category === "pants"
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
    event.stopPropagation();
    addItemOnFav(pantId);
    setLocalFav([...localFav, pantId]);
  };

  const handleDeleteFromFav = (pantId, event) => {
    event.stopPropagation(); // Prevent event from propagating to the parent
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
    return <Loader text="Loading products ..." />;
  }

  return (
    <div>
      {Menpants.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((pant) => {
              const isOnCart = localCart.includes(pant._id);
              const isOnFav = localFav.includes(pant._id);

              return (
                <div key={pant._id} onClick={() => showProduct(pant._id)}>
                  <ProductCard
                    itemImage={`data:${
                      pant.image.contentType
                    };base64,${Buffer.from(pant.image.data).toString(
                      "base64"
                    )}`}
                    itemName={pant.name}
                    itemDesc={pant.description}
                    itemPrice={`RWF ${pant.price}`}
                    handleAddToCart={(event) =>
                      handleAddToCart(pant._id, event)
                    } // Pass event here
                    deleteItem={(event) => handleDeleteItem(pant._id, event)} // Pass event here
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={(event) => handleAddToFav(pant._id, event)} // Pass event here
                    deleteFromFav={(event) =>
                      handleDeleteFromFav(pant._id, event)
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
