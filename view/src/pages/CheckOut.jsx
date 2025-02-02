import { useState, useContext, useEffect } from "react";
import { CgInfo } from "react-icons/cg";
import { ThemeContext } from "../../constants/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { CartContext } from "../../constants/cartItems";
import { toast, ToastContainer } from "react-toastify";
import rwandaData from "../../constants/rwanda";

const OrderForm = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { itemsOnCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    phone: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    termsAccepted: false,
  });
  const availableProvinces = rwandaData.data.map((provinceObj) =>
    Object.keys(provinceObj)[0]
  );

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableCells, setAvailableCells] = useState([]);
  const [availableVillages, setAvailableVillages] = useState([]);

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

  // Helper functions to get the next-level options from the JSON data

  const getDistricts = (provinceName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      // provinceObj[provinceName] is an array of district objects.
      return provinceObj[provinceName].map((districtObj) =>
        Object.keys(districtObj)[0]
      );
    }
    return [];
  };

  const getSectors = (provinceName, districtName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      const districtObj = provinceObj[provinceName].find(
        (d) => d[districtName]
      );
      if (districtObj) {
        // districtObj[districtName] is an array of sector objects.
        return districtObj[districtName].map((sectorObj) =>
          Object.keys(sectorObj)[0]
        );
      }
    }
    return [];
  };

  const getCells = (provinceName, districtName, sectorName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      const districtObj = provinceObj[provinceName].find(
        (d) => d[districtName]
      );
      if (districtObj) {
        const sectorObj = districtObj[districtName].find(
          (s) => s[sectorName]
        );
        if (sectorObj) {
          // sectorObj[sectorName] is an array of cell objects.
          return sectorObj[sectorName].map((cellObj) =>
            Object.keys(cellObj)[0]
          );
        }
      }
    }
    return [];
  };

  const getVillages = (provinceName, districtName, sectorName, cellName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      const districtObj = provinceObj[provinceName].find(
        (d) => d[districtName]
      );
      if (districtObj) {
        const sectorObj = districtObj[districtName].find(
          (s) => s[sectorName]
        );
        if (sectorObj) {
          const cellObj = sectorObj[sectorName].find(
            (c) => c[cellName]
          );
          if (cellObj) {
            // cellObj[cellName] is an array of village names.
            return cellObj[cellName];
          }
        }
      }
    }
    return [];
  };

  // Handlers for changes in the selects

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData((prev) => ({
      ...prev,
      province: selectedProvince,
      district: "",
      sector: "",
      cell: "",
      village: "",
    }));
    // Update districts based on selected province
    setAvailableDistricts(getDistricts(selectedProvince));
    // Reset lower levels
    setAvailableSectors([]);
    setAvailableCells([]);
    setAvailableVillages([]);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      sector: "",
      cell: "",
      village: "",
    }));
    setAvailableSectors(getSectors(formData.province, selectedDistrict));
    setAvailableCells([]);
    setAvailableVillages([]);
  };

  const handleSectorChange = (e) => {
    const selectedSector = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sector: selectedSector,
      cell: "",
      village: "",
    }));
    setAvailableCells(getCells(formData.province, formData.district, selectedSector));
    setAvailableVillages([]);
  };

  const handleCellChange = (e) => {
    const selectedCell = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cell: selectedCell,
      village: "",
    }));
    setAvailableVillages(
      getVillages(formData.province, formData.district, formData.sector, selectedCell)
    );
  };

  const handleVillageChange = (e) => {
    const selectedVillage = e.target.value;
    setFormData((prev) => ({ ...prev, village: selectedVillage }));
  };

  // A simple change handler for the phone input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const realTime = `${hours}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = realTime;

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
      console.log("form error", errors);
    } else {
      console.log("no error!");
      // Check for required data
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

  // Get subtotal from location state
  const { cartTotal: subtotal } = location.state || {};
  useEffect(() => {
    if (!subtotal) {
      navigate(-1);
    } else {
      setCost(subtotal);
    }
  }, [subtotal, navigate]);

  const formattedCost = new Intl.NumberFormat("en-US").format(cost);

  return (
    <div className={`${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <ToastContainer />
      <div
        className={`flex flex-col lg:flex-row items-center p-8 ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        {/* Order Form */}
        <form className="max-w-4xl w-full flex flex-col justify-start mx-0 smm:mx-auto p-0 smm:p-8 rounded-lg">
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

          {/* Delivery Address Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Delivery Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Province select */}
              <select
                className="p-3 h-[3.1rem] outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
              >
                <option value="" disabled>
                  Select a province
                </option>
                {availableProvinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {formErrors.province && (
                <p className="text-red-500">{formErrors.province}</p>
              )}

              {/* District select */}
              <select
                className="p-3 h-[3.1rem] outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                disabled={!formData.province}
              >
                <option value="" disabled>
                  {formData.province
                    ? "Select a district"
                    : "Select a province first"}
                </option>
                {availableDistricts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {formErrors.district && (
                <p className="text-red-500">{formErrors.district}</p>
              )}

              {/* Sector select */}
              <select
                className="p-3 h-[3.1rem] outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                name="sector"
                value={formData.sector}
                onChange={handleSectorChange}
                disabled={!formData.district}
              >
                <option value="" disabled>
                  {formData.district
                    ? "Select a sector"
                    : "Select a district first"}
                </option>
                {availableSectors.map((sector, index) => (
                  <option key={index} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              {formErrors.sector && (
                <p className="text-red-500">{formErrors.sector}</p>
              )}

              {/* Cell select */}
              <select
                className="p-3 h-[3.1rem] outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                name="cell"
                value={formData.cell}
                onChange={handleCellChange}
                disabled={!formData.sector}
              >
                <option value="" disabled>
                  {formData.sector
                    ? "Select a cell"
                    : "Select a sector first"}
                </option>
                {availableCells.map((cell, index) => (
                  <option key={index} value={cell}>
                    {cell}
                  </option>
                ))}
              </select>
              {formErrors.cell && (
                <p className="text-red-500">{formErrors.cell}</p>
              )}

              {/* Village select */}
              <select
                className="p-3 h-[3.1rem] outline-none rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                name="village"
                value={formData.village}
                onChange={handleVillageChange}
                disabled={!formData.cell}
              >
                <option value="" disabled>
                  {formData.cell
                    ? "Select a village"
                    : "Select a cell first"}
                </option>
                {availableVillages.map((village, index) => (
                  <option key={index} value={village}>
                    {village}
                  </option>
                ))}
              </select>
              {formErrors.village && (
                <p className="text-red-500">{formErrors.village}</p>
              )}
            </div>
          </div>

          {/* Amount to pay Section */}
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
              method provided after getting your products. In case of any issues,
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
