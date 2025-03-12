import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/Landing";
import About from "./pages/About";
import ShopNow from "./pages/ShopNow";
import NotFound from "./pages/Notfound";
import Contact from "./pages/Contacts";
import AdminDashboard from "../admin/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from "./pages/Signup.jsx";
import CartPage from "./pages/Cart.jsx";
import OrderForm from "./pages/CheckOut.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import NewAccount from "./pages/newAccount.jsx";
import OfferComfirmation from "./pages/OfferComfirmation.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AuthorizedAdmin from "../constants/AuthorizedAdmin.jsx";
import CategorySection from "./components/WhatWeSell.jsx";
import PaymentPage from "./pages/Pay.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import SecurityAlert from "./pages/SecurityAlert.jsx";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
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