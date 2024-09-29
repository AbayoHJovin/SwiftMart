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
import Login from "./pages/Login.jsx";
import SignupForm from "./pages/Signup.jsx";
import { ThemeProvider } from "../constants/ThemeContext.jsx";
import CartPage from "./pages/Cart.jsx";
import CurrentUser from "../constants/currentUser.jsx";
import CartItems from "../constants/cartItems.jsx";
import OrderForm from "./pages/CheckOut.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import { apiUrl } from "./lib/apis.js";
import NewAccount from "./pages/newAccount.jsx";
import OfferComfirmation from "./pages/OfferComfirmation.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AuthorizedAdmin from "../constants/AuthorizedAdmin.jsx";

function App() {
  useEffect(() => {
    fetch(`${apiUrl}/refresh_token`, {
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
    path: "/shop/:gender/:product",
    element: (
      <CartItems>
        <ShopNow />
      </CartItems>
    ),
  },
  {
    path: "/shop/favourites",
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
  {
    path: "/authorized/Admin",
    element: (
      <AuthorizedAdmin>
        <AdminDashboard />
      </AuthorizedAdmin>
    ),
  },
  {
    path: "/account",
    element: (
      <CartItems>
        <NewAccount />
      </CartItems>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
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
  { path: "offerComfirmation", element: <OfferComfirmation /> },
  {
    path: "/try/admin/auth",
    element: (

      <AuthorizedAdmin>
        <AdminAuth />
      </AuthorizedAdmin>
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
