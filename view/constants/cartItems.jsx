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
  const [loading,setLoading]=useState(false)
  function fetchCartItems() {
    if (currentUser) {
      const token = localStorage.getItem("token");
      fetch(
        `${apiUrl}/getCartItems?currentUser=${currentUser.userId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if(data.products){
            setIsOnCart(data.products);
          }else{
            setIsOnCart([])
          }
        })
        .catch((e) => console.log("error getting products", e));
    }
  }
  useEffect(() => {
    fetchCartItems();
  }, []);
  const navigate = useNavigate();
  function addItemOncart(itemId) {
    if (!currentUser) {
      console.log("no user");
      navigate("/login");
      return;
    }
    setLoading(true)
    fetch(`${apiUrl}/addItemOncart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.userId, prodId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchCartItems();
        setLoading(false)
      })
      .catch((e) => console.error(e));
  }
  function deleteItem(itemId) {
    setLoading(true)
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
          setLoading(false)
        })
        .catch((e) => console.error(e));
    }
  }

  return (
    <CartContext.Provider value={{loading, itemsOnCart, addItemOncart, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
}
