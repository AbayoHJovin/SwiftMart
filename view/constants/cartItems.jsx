/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "./currentUser";

export const CartContext = createContext();
export default function CartItems({ children }) {
  const [itemsOnCart, setIsOnCart] = useState([]);
  const { CurrentUser } = useContext(CurrentUserContext);
  const token=localStorage.getItem("token")

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch(`http://localhost:5000/getCartItems?currentUser=${CurrentUser._id}`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsOnCart(data.data.products);
      })
      .catch((e) => console.error(e));
  }, [CurrentUser._id, token]);

  function addItemOncart(itemId) {
    if (!CurrentUser._id) {
      console.log("Unauthorized");
    }
    fetch("http://localhost:5000/addItemOncart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: CurrentUser._id, prodId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => console.error(e));
  }
  function deleteItem(itemId) {
    fetch(
      `http://localhost:5000/deleteCartItem?itemId=${itemId}&userId=${CurrentUser._id}
`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((e) => console.error(e));
  }

  return (
    <CartContext.Provider value={{ itemsOnCart, addItemOncart, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
}
