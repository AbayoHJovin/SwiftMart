import { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { CgClose, CgHeart, CgShoppingCart } from "react-icons/cg";
import { Drawer, List, ListItem } from "@mui/material";
import { ThemeContext } from "../../constants/ThemeContext";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 460) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop Now", href: "/shop" },
    { name: "Contacts", href: "/contacts" },
    { name: "Account", href: "/account" },
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
    <nav
      className={`flex items-center p-4 justify-between px-10 text-black bg-[#dadce0] dark:bg-black dark:text-white lg:px-36 sticky top-0 z-50`}
    >
      {isMobile ? (
        theme === "dark" ? (
          <img
            src="/mobileLogoDarkMode.png"
            alt="logo"
            className="h-[4.5rem] w-[10rem] logo"
          />
        ) : (
          <img
            src="/mobileLogoWhiteMode.png"
            alt="logo"
            className="h-[4.5rem] w-[10rem] logo"
          />
        )
      ) : theme === "dark" ? (
        <img
          src="/pcLogoDarkMode.png"
          alt="logo"
          className="h-[4.5rem] w-[10rem] logo"
        />
      ) : (
        <img
          src="/pcLogoLightMode.png"
          alt="logo"
          className="h-[4.5rem] w-[10rem] logo"
        />
      )}

      {/* For larger devices */}
      <div className="hidden sm:flex justify-center items-center">
        <div className="p-2 space-x-7 text-center items-center justify-center flex rounded-full px-5">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="cursor-pointer hover:text-blue-600"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex space-x-5">
        <FaSearch className="cursor-pointer" />
        {theme === "dark" ? (
          <FaSun onClick={toggleTheme} className="cursor-pointer" />
        ) : (
          <FaMoon onClick={toggleTheme} className="cursor-pointer" />
        )}
        <CgHeart className="cursor-pointer" />
        <a href="/cart">
          <CgShoppingCart className="cursor-pointer" />
        </a>
      </div>

      {/* For smaller devices */}
      <div className="block sm:hidden">
        <div className="flex items-center space-x-4">
          {theme === "dark" ? (
            <FaSun onClick={toggleTheme} />
          ) : (
            <FaMoon onClick={toggleTheme} />
          )}
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
              <FaSearch className="cursor-pointer text-black dark:text-white" />
            </ListItem>
            <ListItem>
              <CgHeart className="cursor-pointer text-black dark:text-white" />
            </ListItem>
            <ListItem>
              <a href="/cart">
                <CgShoppingCart className="cursor-pointer text-black dark:text-white" />
              </a>
            </ListItem>
          </List>
        </Drawer>
      </div>
    </nav>
  );
}
