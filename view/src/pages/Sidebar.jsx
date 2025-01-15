/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ArrowUpRight, LogOut, SidebarIcon } from "lucide-react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const Sidebar = ({
  labels,
  handleConfirmLogout,
  isLoggingOut,
  activeTab,
  onTabChange,
}) => {
  // const [tabValue, setTabValue] = useState(1);
  const [shrink, setShrink] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function triggerShrink() {
    setShrink(!shrink);
  }

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setIsMobile(width < 960);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const selectedLabel = labels.find((item) => item.value === activeTab);
    setCurrentLabel(selectedLabel || null);
  }, [labels, activeTab]);

  const navigate = useNavigate();

  if (isLoggingOut) {
    return (
      <div className="text-lg flex justify-center tex-center min-h-screen">
        Signing out ...
      </div>
    );
  }

  return (
    <div className="z-40">
      {isMobile && (
        <div className="flex xmd:hidden p-3 items-center justify-between px-10">
          <a href="/">
            <img
              onClick={() => navigate("/")}
              src="/mobileLogo.svg"
              alt="logo"
              width={80}
            />
          </a>
          <div>
            <AiOutlineMenu
              size={30}
              onClick={() => setOpenDrawer(!openDrawer)}
              className="cursor-pointer text-black dark:text-white"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-50 flex">
        <div
          className={`bg-white dark:bg-[#424447]  fixed h-screen z-30 xmd:relative xmd:translate-x-0 xmd:flex flex-col top-0 left-0 transform transition-all duration-300 ease-in-out ${
            openDrawer ? "translate-x-0" : "-translate-x-full"
          } ${shrink ? "w-20" : "w-72"} ${isMobile ? "absolute" : "relative"}`}
        >
          <div
            onClick={triggerShrink}
            className="w-full flex justify-end p-5 cursor-pointer"
          >
            <SidebarIcon className="flex justify-end text-black dark:text-white" />
          </div>

          {shrink ? (
            <a href="/">
              <img
                onClick={() => navigate("/")}
                src="/mobileLogo.svg"
                alt="logo"
                className="py-12 w-20 cursor-pointer"
              />
            </a>
          ) : (
            <a href="/">
              <img
                onClick={() => navigate("/")}
                src="/logo.svg"
                alt="logo"
                className="p-12 cursor-pointer"
              />
            </a>
          )}

          {labels.map((label) => (
            <div
              key={label.value}
              onClick={() => onTabChange(label.value)}
              className={`flex items-center ${
                activeTab === label.value
                  ? "bg-green-600 dark:bg-green-700 border-l-4 text-white dark:text-gray-200 border-green-800 dark:border-green-500"
                  : "bg-transparent dark:bg-transparent"
              } hover:bg-green-600 dark:hover:bg-green-700 text-3xl ${
                shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
              } text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-gray-100 cursor-pointer rounded transition-colors duration-200`}
            >
              <span className="mr-2">{label.icon}</span>
              {!shrink && <h1 className="text-lg">{label.text}</h1>}
            </div>
          ))}

          <div
            onClick={openModal}
            className={`flex items-center hover:bg-green-200 dark:hover:bg-green-700 text-gray-700 dark:text-gray-200 hover:text-gray-800 text-3xl ${
              shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
            } cursor-pointer rounded transition-colors duration-200`}
          >
            <span className="mr-2">
              <LogOut />
            </span>
            {!shrink && <h1 className="text-lg">Logout</h1>}
          </div>
          <a href="/">
            <div
              className={`flex items-center gap-3 hover:bg-green-200 dark:hover:bg-green-700 text-gray-700 dark:text-gray-200 hover:text-gray-800 text-3xl ${
                shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
              } cursor-pointer rounded transition-colors duration-200 absolute bottom-0 left-0 p-5`}
            >
              <span className="mr-2">
                <ArrowUpRight />
              </span>
              {!shrink && <h1 className="text-lg">Back</h1>}
            </div>
          </a>
        </div>

        {isMobile && openDrawer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setOpenDrawer(false)}
          ></div>
        )}

        <div className="flex-1 overflow-y-scroll h-screen bg-white dark:bg-black">
          {currentLabel?.page}
        </div>
      </div>
      <Modal
        isModalOpen={isModalOpen}
        handleConfirmLogout={handleConfirmLogout}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Sidebar;
