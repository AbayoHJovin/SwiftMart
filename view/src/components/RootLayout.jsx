import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../../constants/ThemeContext';
import { NotificationProvider } from '../../constants/NotificationContext';
import CurrentUser from '../../constants/currentUser';
import CartItems from '../../constants/cartItems';
import FavItems from '../../constants/favItems';
import { apiUrl } from '../lib/apis';

export const RootLayout = () => {
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