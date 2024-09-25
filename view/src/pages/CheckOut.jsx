import { useState, useContext, useEffect } from "react";
import { CgInfo } from "react-icons/cg";
import { ThemeContext } from "../../constants/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { CartContext } from "../../constants/cartItems";
import { apiUrl } from "../lib/apis";
import Loader3 from "../components/Loading3";

const OrderForm = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { itemsOnCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser ? currentUser.username : "",
    lastName: "",
    email: currentUser ? currentUser.email : "",
    phone: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    paymentMethod: "",
    termsAccepted: false,
  });

  const [productsId, setProductsId] = useState([]);
  const [cost, setCost] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser || !itemsOnCart) {
      navigate("/login");
    }
    const ids = [];
    for (let i = 0; i < itemsOnCart.length; i++) {
      if (itemsOnCart[i] && itemsOnCart[i].productId) {
        ids.push(itemsOnCart[i].productId);
      }
    }

    setProductsId(ids);
  }, [itemsOnCart, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const now = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const realTime = `${hours}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
  const currentDay = daysOfWeek[now.getDay()];
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = realTime;
  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const validateForm = () => {
    const errors = {};
    const {
      firstName,
      lastName,
      email,
      phone,
      province,
      district,
      sector,
      cell,
      village,
      paymentMethod,
      termsAccepted,
    } = formData;

    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone number is required";
    if (!province) errors.province = "Province is required";
    if (!district) errors.district = "District is required";
    if (!sector) errors.sector = "Sector is required";
    if (!cell) errors.cell = "Cell is required";
    if (!village) errors.village = "Village is required";
    if (!paymentMethod) errors.paymentMethod = "Please select a payment method";
    if (!termsAccepted)
      errors.termsAccepted = "You must accept the terms and conditions";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      const dataToSend = {
        userId: currentUser._id,
        names: formData.firstName + "," + formData.lastName,
        email: formData.email,
        address:
          formData.province +
          "," +
          formData.district +
          "," +
          formData.sector +
          "," +
          formData.cell +
          "," +
          formData.village,
        phoneNumber: formData.phone,
        paymentMethod: formData.paymentMethod,
        amount: "100",
        products: productsId,
        day: currentDay,
        date: currentDate,
        time: currentTime,
      };
      setLoading(true);
      fetch(`${apiUrl}/addOffer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == "Offer placed") {
            handleRedirect();
          }
        })
        .catch((e) => console.error(e));
    }
  };
  function handleRedirect() {
    fetch(`${apiUrl}/deleteAllCartItems?userId=${currentUser._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.message == "Reset the cart") {
          navigate("/offerComfirmation");
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }
  const { amount } = useParams();
  useEffect(() => {
    if (!amount) {
      navigate(-1);
    } else {
      setCost(amount);
    }
  }, [amount, navigate]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen content-center">
      <Loader3/>
      <h1 className="text-lg">Placing order</h1>
      </div>
    )
  }
  return (
    <div className={`${theme == "dark" ? "bg-black" : "bg-white"}`}>
      <div
        className={`flex flex-col lg:flex-row items-center p-8 ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        {/* Order Form */}
        <form
          className="max-w-4xl w-full flex flex-col justify-start mx-0 smm:mx-auto p-0 smm:p-8 rounded-lg "
          onSubmit={handleSubmit}
        >
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
                type="text"
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {formErrors.firstName && (
                <p className="text-red-500">{formErrors.firstName}</p>
              )}

              <input
                className="p-3 outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                type="text"
                placeholder="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {formErrors.lastName && (
                <p className="text-red-500">{formErrors.lastName}</p>
              )}

              <input
                className="p-3 outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-500">{formErrors.email}</p>
              )}

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
              Transaction method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Mobile Money",
                "Cash Transaction",
                "Card Payments",
                "Bank Transfers",
              ].map((method) => (
                <div className="flex items-center space-x-3" key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                  />
                  <h1 className="font-bold dark:text-gray-100">{method}</h1>
                </div>
              ))}
              {formErrors.paymentMethod && (
                <p className="text-red-500">{formErrors.paymentMethod}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Delivery Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Province", "District", "Sector", "Cell", "Village"].map(
                (field) => (
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
                )
              )}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Amount to pay
            </h3>
            <h1>{cost}</h1>
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

          {/* Action Buttons */}
          <div className="flex flex-col sssm:flex-row justify-between mt-8 gap-3">
            <button
              type="submit"
              className="p-3 w-full sssm:order-2 sssm:w-1/3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Purchase
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

        {/* Confirm Image */}
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
