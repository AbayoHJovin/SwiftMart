import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="relative bottom-0 bg-[#D4ECDC] z-0 dark:bg-[#003D3B] text-black dark:text-white py-10 px-5 mt-10 md:px-20 overflow-hidden footer-curved-background">
        <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col sssm:flex-row sssm:space-x-20 mb-10 md:mb-0">
            <div className="mb-8 md:mb-0">
              <h3 className="font-semibold mb-4">SHOP</h3>
              <ul className="space-y-2">
                <li>
                  <h1
                    onClick={() => navigate("/shop/Both/pants")}
                    className="hover:underline cursor-pointer"
                  >
                    Pants
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Both/pants")}
                    className="hover:underline cursor-pointer"
                  >
                    Shorts
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Both/shirts")}
                    className="hover:underline cursor-pointer"
                  >
                    Shirts
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Both/shirts")}
                    className="hover:underline cursor-pointer"
                  >
                    T-shirts
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Both/shoes")}
                    className="hover:underline cursor-pointer"
                  >
                    Shoes
                  </h1>
                </li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0">
              <h3 className="font-semibold mb-4">HELP</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/contacts" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0">
              <h3 className="font-semibold mb-4">ABOUT</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Our locations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Our team
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <h3 className="font-semibold mb-4 text-center md:text-left">
              Sign up to get 10% off your first order
            </h3>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none w-full md:w-auto"
              />
              <button className="bg-[#FFD700] text-black px-4 py-2 rounded-full w-full md:w-auto">
                Subscribe
              </button>
            </div>
            <div className="flex justify-center md:justify-start space-x-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E4405F]"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1877F2]"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1DA1F2]"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0077B5]"
              >
                <FaLinkedinIn size={24} />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#09b347]"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-sm relative z-10">
          <p>© 2024 HomeDel, Inc. All Rights Reserved</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/try/admin/auth" className="hover:underline">
              admin
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 text-center">
        <h1>Made with 💖 by A. H. Jovin</h1>
      </div>
    </div>
  );
};

export default Footer;
