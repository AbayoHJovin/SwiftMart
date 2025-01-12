import { useState, useContext, useEffect } from "react";
import { CgInfo } from "react-icons/cg";
import { ThemeContext } from "../../constants/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { CartContext } from "../../constants/cartItems";
// import Loader3 from "../components/Loading3";
import { toast, ToastContainer } from "react-toastify";

const OrderForm = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { itemsOnCart } = useContext(CartContext);
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    termsAccepted: false,
  });
  const provinces = ["Kigali", "Northern", "Southern", "Eastern", "Western"];

  const [productsId, setProductsId] = useState([]);
  const [cost, setCost] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || !itemsOnCart) {
      navigate("/login");
    }

    const products = itemsOnCart
      .map((item) => {
        if (item && item.productId && item.quantity) {
          return { productId: item.productId, quantity: item.quantity };
        }
        return null;
      })
      .filter(Boolean);

    setProductsId(products);
  }, [itemsOnCart, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const realTime = `${hours}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = realTime;
  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const validateForm = () => {
    const errors = {};
    const {
      phone,
      province,
      district,
      sector,
      cell,
      village,
      termsAccepted,
    } = formData;

    if (!phone) errors.phone = "Phone number is required";
    if (!province) errors.province = "Province is required";
    if (!district) errors.district = "District is required";
    if (!sector) errors.sector = "Sector is required";
    if (!cell) errors.cell = "Cell is required";
    if (!village) errors.village = "Village is required";
    if (!termsAccepted)
      errors.termsAccepted = "You must accept the terms and conditions";

    return errors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("form error", formErrors);
    } else {
      console.log("no error!");
      if (!currentUser || !formData || !productsId || !subtotal) {
        toast.error("Missing required information!");
        return;
      }

      const dataToSend = {
        userId: currentUser.userId,
        address: [
          formData.province,
          formData.district,
          formData.sector,
          formData.cell,
          formData.village,
        ].join("-"),
        phoneNo: formData.phone,
        price: subtotal,
        products: productsId,
        orderDate: `${currentDate} ${currentTime}`,
      };

      navigate("/paymentPage", { state: { amount: subtotal, dataToSend } });
    }
  };

  //   setLoading(true);
  

 
  const { subtotal } = location.state || {};
  useEffect(() => {
    if (!subtotal) {
      navigate(-1);
    } else {
      setCost(subtotal);
    }
  }, [subtotal, navigate]);
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen content-center">
  //       <Loader3 />
  //       <h1 className="text-lg">Placing order</h1>
  //     </div>
  //   );
  // }
  const formattedCost = new Intl.NumberFormat("en-US").format(cost);

  return (
    <div className={`${theme == "dark" ? "bg-black" : "bg-white"}`}>
      <ToastContainer />
      <div
        className={`flex flex-col lg:flex-row items-center p-8 ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        {/* Order Form */}
        <form className="max-w-4xl w-full flex flex-col justify-start mx-0 smm:mx-auto p-0 smm:p-8 rounded-lg ">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Complete your order
          </h2>

          {/* Personal Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                className="p-3 outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                type="tel"
                minLength={10}
                placeholder="Phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {formErrors.phone && (
                <p className="text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Delivery Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                className="p-3 h-[3.1rem] outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                name="province"
                value={formData.province}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a province
                </option>
                {provinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              {["District", "Sector", "Cell", "Village"].map((field) => (
                <div key={field}>
                  <input
                    className="p-3 outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                    type="text"
                    placeholder={field}
                    name={field.toLowerCase()}
                    value={formData[field.toLowerCase()]}
                    onChange={handleChange}
                  />
                  {formErrors[field.toLowerCase()] && (
                    <p className="text-red-500">
                      {formErrors[field.toLowerCase()]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Amount to pay
            </h3>
            <h1>RWF {formattedCost}</h1>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-5 mb-8">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
            />
            <h1 className="dark:text-gray-100">
              I agree to the terms and conditions of this service
            </h1>
            {formErrors.termsAccepted && (
              <p className="text-red-500">{formErrors.termsAccepted}</p>
            )}
          </div>

          {/* Important Information Section */}
          <div className="flex items-start space-x-5 mb-8">
            <CgInfo className="text-[4rem] text-red-500" />
            <h1 className="dark:text-gray-100">
              Note that after you click on complete purchase, you will be called
              shortly on the phone number you entered. You will pay using the
              method provided after getting your products.In case of any issues,
              call or WhatsApp us on +250798509561.
            </h1>
          </div>

          <div className="flex flex-col sssm:flex-row justify-between mt-8 gap-3">
            <button
              onClick={handleSubmit}
              className="p-3 w-full sssm:order-2 sssm:w-1/3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Pay RWF {formattedCost}
            </button>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="p-3 w-full sssm:order-1 sssm:w-1/3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
        <img
          src="/confirmImage.png"
          alt="payment"
          className="hidden xlg:block w-full h-auto lg:ml-10"
        />
      </div>
    </div>
  );
};

export default OrderForm;
