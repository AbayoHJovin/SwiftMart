// /* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
// import { LogOut, SidebarIcon } from "lucide-react";
// import { AiOutlineMenu } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { apiUrl } from "../lib/apis";
// import Modal from "../components/Modal";

// const Sidebar = ({ labels, handleLogout }) => {
//   const [tabValue, setTabValue] = useState(1);
//   const [shrink, setShrink] = useState(false);
//   const [currentLabel, setCurrentLabel] = useState(null);
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isModalOpen,setIsModalOpen]=useState(false)

//   function triggerShrink() {
//     setShrink(!shrink);
//   }

//   useEffect(() => {
//     function handleResize() {
//       const width = window.innerWidth;
//       setIsMobile(width < 960);
//     }
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const handleConfirmLogout = () => {
//     handleClose();
//     setIsLoggingOut(true);
//     fetch(`${apiUrl}/logout`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.message === "Logged out") {
//           localStorage.removeItem("token");
//           navigate("/");
//         }
//       })
//       .catch(() => {
//         toast.error("Can't logout!");
//       })
//       .finally(() => {
//         setIsLoggingOut(false);
//       });
//   };

//   useEffect(() => {
//     const selectedLabel = labels.find((item) => item.value === tabValue);
//     setCurrentLabel(selectedLabel || null);
//   }, [labels, tabValue]);
//   const navigate = useNavigate();
//   if (isLoggingOut) {
//     return <div>Signing out ...</div>
//   }
// function openModal(){
//   setIsModalOpen(true)
// }
//   return (
//     <div>
//       <Modal/>
//       {isMobile && (
//         <div className="flex xmd:hidden p-3 items-center justify-between px-10">
//           <img
//             onClick={() => navigate("/")}
//             src="./mobileLogo.svg"
//             alt="logo"
//             width={80}
//           />
//           <div>
//             <AiOutlineMenu
//               size={30}
//               onClick={() => setOpenDrawer(!openDrawer)}
//               className="cursor-pointer"
//             />
//           </div>
//         </div>
//       )}

//       <div className="bg-gray-50 flex">
//         <div
//           className={`bg-white fixed h-screen z-30 xmd:relative xmd:translate-x-0 xmd:flex flex-col top-0 left-0 transform transition-all duration-300 ease-in-out ${
//             openDrawer ? "translate-x-0" : "-translate-x-full"
//           } ${shrink ? "w-20" : "w-72"} ${isMobile ? "absolute" : "relative"}`}
//         >
//           <div
//             onClick={triggerShrink}
//             className="w-full flex justify-end p-5 cursor-pointer"
//           >
//             <SidebarIcon className="flex justify-end" />
//           </div>

//           {shrink ? (
//             <img
//               onClick={() => navigate("/")}
//               src="./mobileLogo.svg"
//               alt="logo"
//               className="py-12 w-20 cursor-pointer"
//             />
//           ) : (
//             <img
//               onClick={() => navigate("/")}
//               src="./logo.svg"
//               alt="logo"
//               className="p-12 cursor-pointer"
//             />
//           )}

//           {labels.map((label) => (
//             <div
//               key={label.value}
//               onClick={() => setTabValue(label.value)}
//               className={`flex items-center ${
//                 tabValue === label.value
//                   ? "bg-green-200 border-l-4 border-green-800"
//                   : "bg-transparent"
//               } hover:bg-green-200 text-gray-700 text-3xl ${
//                 shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
//               } cursor-pointer rounded transition-colors duration-200`}
//             >
//               <span className="mr-2">{label.icon}</span>
//               {!shrink && <h1 className="text-lg">{label.text}</h1>}
//             </div>
//           ))}
//           <div
//             onClick={openMOdal}
//             className={`flex items-center hover:bg-green-200 text-gray-700 text-3xl ${
//               shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
//             } cursor-pointer rounded transition-colors duration-200`}
//           >
//             <span className="mr-2">
//               <LogOut/>
//             </span>
//             {!shrink && <h1 className="text-lg">Logout</h1>}
//           </div>
//         </div>

//         {isMobile && openDrawer && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-20"
//             onClick={() => setOpenDrawer(false)}
//           ></div>
//         )}

//         <div className="flex-1 overflow-y-scroll h-screen">
//           {currentLabel?.page}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { LogOut, SidebarIcon } from "lucide-react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../lib/apis";
import Modal from "../components/Modal";

const Sidebar = ({ labels }) => {
  const [tabValue, setTabValue] = useState(1);
  const [shrink, setShrink] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleConfirmLogout = () => {
    setIsModalOpen(false);
    setIsLoggingOut(true);
    fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const selectedLabel = labels.find((item) => item.value === tabValue);
    setCurrentLabel(selectedLabel || null);
  }, [labels, tabValue]);

  const navigate = useNavigate();

  if (isLoggingOut) {
    return <div>Signing out ...</div>;
  }

  return (
    <div>
      {isMobile && (
        <div className="flex xmd:hidden p-3 items-center justify-between px-10">
          <img
            onClick={() => navigate("/")}
            src="./mobileLogo.svg"
            alt="logo"
            width={80}
          />
          <div>
            <AiOutlineMenu
              size={30}
              onClick={() => setOpenDrawer(!openDrawer)}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-50 flex">
        <div
          className={`bg-white fixed h-screen z-30 xmd:relative xmd:translate-x-0 xmd:flex flex-col top-0 left-0 transform transition-all duration-300 ease-in-out ${
            openDrawer ? "translate-x-0" : "-translate-x-full"
          } ${shrink ? "w-20" : "w-72"} ${isMobile ? "absolute" : "relative"}`}
        >
          <div
            onClick={triggerShrink}
            className="w-full flex justify-end p-5 cursor-pointer"
          >
            <SidebarIcon className="flex justify-end" />
          </div>

          {shrink ? (
            <img
              onClick={() => navigate("/")}
              src="./mobileLogo.svg"
              alt="logo"
              className="py-12 w-20 cursor-pointer"
            />
          ) : (
            <img
              onClick={() => navigate("/")}
              src="./logo.svg"
              alt="logo"
              className="p-12 cursor-pointer"
            />
          )}

          {labels.map((label) => (
            <div
              key={label.value}
              onClick={() => setTabValue(label.value)}
              className={`flex items-center ${
                tabValue === label.value
                  ? "bg-green-200 border-l-4 border-green-800"
                  : "bg-transparent"
              } hover:bg-green-200 text-gray-700 text-3xl ${
                shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
              } cursor-pointer rounded transition-colors duration-200`}
            >
              <span className="mr-2">{label.icon}</span>
              {!shrink && <h1 className="text-lg">{label.text}</h1>}
            </div>
          ))}
          <div
            onClick={openModal}
            className={`flex items-center hover:bg-green-200 text-gray-700 text-3xl ${
              shrink ? "my-2 mx-2 px-4 py-3" : "my-2 mx-5 px-20 py-3"
            } cursor-pointer rounded transition-colors duration-200`}
          >
            <span className="mr-2">
              <LogOut />
            </span>
            {!shrink && <h1 className="text-lg">Logout</h1>}
          </div>
        </div>

        {isMobile && openDrawer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setOpenDrawer(false)}
          ></div>
        )}

        <div className="flex-1 overflow-y-scroll h-screen">
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
