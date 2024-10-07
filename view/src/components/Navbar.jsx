/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { CgClose, CgShoppingCart } from "react-icons/cg";
import { Drawer, List, ListItem, Badge } from "@mui/material"; // Add Badge for displaying the cart count
import CartItems, { CartContext } from "../../constants/cartItems"; // Import CartContext
import Search from "./searchComponent";
import { SearchIcon, ShoppingCart, UserPlus } from "lucide-react";
import { ThemeContext } from "../../constants/ThemeContext";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { itemsOnCart } = useContext(CartContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 375) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop/Both/pants" },
    { name: "Contacts", href: "/contacts" },
    { name: "Account", href: "/account/account" },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  return (
    <CartItems>
      <nav
        className={`flex items-center  p-4 justify-between px-10 text-black bg-[#dadce0] dark:bg-black dark:text-white lg:px-36 sticky top-0 z-50`}
      >
        <a href="/">
          <img
            onClick={() => (window.location.href = "/")}
            // src={isMobile ? "/mobileLogo.svg" : "/logo.svg"}
            src="/mobileLogo.svg"
            alt="logo"
            className="h-[4.5rem] w-[10rem] cursor-pointer"
          />
        </a>

        <div className="hidden sm:flex justify-center items-center">
          <div className="p-2 space-x-7 text-center items-center justify-center flex rounded-full px-5">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="cursor-pointer hover:text-green-600"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex space-x-5 items-center">
          <SearchIcon
            onClick={() => setIsModalVisible(true)}
            className="cursor-pointer"
          />
          <a href="/cart" className="relative">
            <Badge
              badgeContent={itemsOnCart.length > 0 ? itemsOnCart.length : 0}
              color="primary"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <ShoppingCart className="cursor-pointer" />
            </Badge>
          </a>
          <a href="/signup" className="cursor-pointer">
            <UserPlus />
          </a>
        </div>

        <div className="block sm:hidden">
          <div className="flex items-center space-x-4">
            <AiOutlineMenu
              className="mr-2 visible sm:hidden"
              onClick={toggleDrawer(true)}
            />
          </div>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              style: {
                width: "75%",
                padding: "20px",
                backgroundColor: theme === "dark" ? "black" : "white",
                color: theme === "dark" ? "white" : "black",
                backdropFilter: "blur(50px)",
                boxShadow: "none",
              },
            }}
          >
            <div
              onClick={toggleDrawer(false)}
              className="flex text-2xl justify-end font-bold cursor-pointer"
            >
              <CgClose className="text-black dark:text-white" />
            </div>
            <List>
              {links.map((link, index) => (
                <ListItem key={index} button onClick={toggleDrawer(false)}>
                  <a
                    href={link.href}
                    className="w-full block text-lg mb-2 text-black dark:text-white"
                  >
                    {link.name}
                  </a>
                </ListItem>
              ))}
              <ListItem>
                <FaSearch
                  onClick={() => {
                    setIsModalVisible(true), setDrawerOpen(false);
                  }}
                  className="cursor-pointer text-black dark:text-white"
                />
              </ListItem>
              <ListItem>
                <a href="/cart">
                  <Badge
                    badgeContent={
                      itemsOnCart.length > 0 ? itemsOnCart.length : 0
                    }
                    color="primary"
                  >
                    <CgShoppingCart className="cursor-pointer text-black dark:text-white" />
                  </Badge>
                </a>
              </ListItem>
              <ListItem>
                <a href="/signup" className="cursor-pointer">
                  <UserPlus />
                </a>
              </ListItem>
            </List>
          </Drawer>
        </div>
      </nav>
      <Search
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </CartItems>
  );
}
