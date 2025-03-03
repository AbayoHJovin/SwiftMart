/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "./currentUser";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../src/lib/apis";

export const CartContext = createContext();
export default function CartItems({ children }) {
  const [itemsOnCart, setIsOnCart] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const [UpdateResponse, setUpdateResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdating,setisUpdating]=useState(false);
  function fetchCartItems() {
    if (currentUser) {
      const token = localStorage.getItem("token");
      fetch(`${apiUrl}/getCartItems?currentUser=${currentUser.userId}`, {
        method: "GET",
        headers: {
          authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.products) {
            setIsOnCart(data.products);
          } else {
            setIsOnCart([]);
          }
        })
        .catch((e) => console.log("error getting products", e));
    }
  }
  useEffect(() => {
    if (currentUser) {
      fetchCartItems();
    }
  }, [currentUser]);
  const navigate = useNavigate();
  function addItemOncart(itemId) {
    if (!currentUser) {
      console.log("no user");
      navigate("/login");
      return;
    }
    setLoading(true);
    fetch(`${apiUrl}/addItemOncart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.userId, prodId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchCartItems();
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }
  function deleteItem(itemId) {
    setLoading(true);
    if (currentUser.userId) {
      fetch(
        `${apiUrl}/deleteCartItem?itemId=${itemId}&userId=${currentUser.userId}
`,
        {
          method: "DELETE",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          fetchCartItems();
          setLoading(false);
        })
        .catch((e) => console.error(e));
    }
  }

  function updateCart(items) {
    console.log("isUpdating cart:", items);
    setisUpdating(true);
    if (currentUser && currentUser.userId) {
      fetch(`${apiUrl}/updateCart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.userId, items }),
      })
        .then((response) => response.json())
        .then((data) => {
          // if(data.message==="Insufficient stock for product."){
            setUpdateResponse(data.message);
          // }
          console.log("data", data);
          // fetchCartItems();
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setisUpdating(false);
        });
    } else {
      console.error("User is not logged in");
      setLoading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        loading,
        itemsOnCart,  
        addItemOncart,
        deleteItem,
        updateCart,
        UpdateResponse,
        isUpdating
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
