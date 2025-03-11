import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LandingPage from "./pages/Landing";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
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
import CategorySection from "./components/WhatWeSell.jsx";
import FavItems from "../constants/favItems.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaymentPage from "./pages/Pay.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import SecurityAlert from "./pages/SecurityAlert.jsx";
import { NotificationProvider } from "../constants/NotificationContext.jsx";
// import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
const queryClient = new QueryClient();

// Root layout component that wraps all routes with necessary providers
const RootLayout = () => {
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

  return (
    <CurrentUser>
      <ThemeProvider>
        <NotificationProvider>
          <CartItems>
            <FavItems>
              <Outlet />
            </FavItems>
          </CartItems>
        </NotificationProvider>
      </ThemeProvider>
    </CurrentUser>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/shop/:gender/:product",
        element: <ShopNow />,
      },
      {
        path: "/shop/favourites",
        element: <ShopNow />,
      },
      {
        path: "/contacts",
        element: <Contact />,
      },
      {
        path: "/authorized/Admin/:option",
        element: (
          <AuthorizedAdmin>
            <AdminDashboard />
          </AuthorizedAdmin>
        ),
      },
      {
        path: "/account/:option",
        element: <NewAccount />,
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
        path: "/checkout",
        element: <OrderForm />,
      },
      {
        path: "/product/:prodId",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/paymentPage",
        element: <PaymentPage />,
      },
      {
        path: "offerComfirmation",
        element: <OfferComfirmation />,
      },
      {
        path: "/try/admin/auth",
        element: (
          <AuthorizedAdmin>
            <AdminAuth />
          </AuthorizedAdmin>
        ),
      },
      {
        path: "/try",
        element: <CategorySection />,
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
      },
      {
        path: "/cancel-reset",
        element: <SecurityAlert />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
