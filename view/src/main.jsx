import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LandingPage from "./pages/Landing";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/About";
import ShopNow from "./pages/ShopNow";
import NotFound from "./pages/Notfound";
import Contact from "./pages/Contacts";
import AdminDashboard from "../admin/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from "./pages/Signup.jsx";
import { ThemeProvider } from "../constants/ThemeContext.jsx";
import CartPage from "./pages/Cart.jsx";
import CurrentUser from "../constants/currentUser.jsx";
import CartItems from "../constants/cartItems.jsx";
import OrderForm from "./pages/CheckOut.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  useEffect(() => {
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((data) => data.json())
      .then((response) => {
        localStorage.setItem("token", response.accessToken);
      })
      .catch((e) => console.error(e));
  }, []);

  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CartItems>
        <LandingPage />
      </CartItems>
    ),
  },
  {
    path: "/about",
    element: (
      <CartItems>
        <About />
      </CartItems>
    ),
  },
  {
    path: "/shop",
    element: (
      <CartItems>
        <ShopNow />
      </CartItems>
    ),
  },
  {
    path: "/contacts",
    element: (
      <CartItems>
        <Contact />
      </CartItems>
    ),
  },
  { path: "/admin", element: <AdminDashboard /> },
  {
    path: "/account",
    element: (
      <CartItems>
        <Account />
      </CartItems>
    ),
  },
  {
    path: "/login",
    element: (
      <CartItems>
        <Login />
      </CartItems>
    ),
  },
  {
    path: "/signup",
    element: (
      <CartItems>
        <SignupForm />
      </CartItems>
    ),
  },
  {
    path: "/checkout/:amount",
    element: (
      <CartItems>
        <OrderForm />
      </CartItems>
    ),
  },
  {
    path: "/product/:prodId",
    element: (
      <CartItems>
        <ProductPage />
      </CartItems>
    ),
  },

  {
    path: "/cart",
    element: (
      <CartItems>
        <CartPage />
      </CartItems>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrentUser>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </CurrentUser>
  </React.StrictMode>
);
