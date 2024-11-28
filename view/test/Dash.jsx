// import { CheckCheckIcon, Clock, ShoppingBasket, Trash } from "lucide-react";
// import { AiOutlineOrderedList } from "react-icons/ai";
// import { CgShutterstock } from "react-icons/cg";
// import { FaMoneyCheck, FaTrophy } from "react-icons/fa";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../admin/AdminNav";
import UseUsers from "../constants/Users";
// import useProducts from "../constants/products";
import { useContext } from "react";
import { OffersContext } from "../constants/Offers";
// import Loader3 from "../src/components/Loading3";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { users } = UseUsers();
  // const { products, popularProds, loading } = useProducts();
  const { kigali, north, south, east, west } =
    useContext(OffersContext);
  // const sales = [
  //   {
  //     name: "Total Sales",
  //     icon: <ShoppingBasket />,
  //     amount: 7890,
  //     bgColor: "bg-red-100",
  //     iconColor: "text-red-500",
  //   },
  //   {
  //     name: "Income",
  //     icon: <FaMoneyCheck />,
  //     amount: "1,000,000",
  //     bgColor: "bg-green-100",
  //     iconColor: "text-green-500",
  //   },
  //   {
  //     name: "Products in Stock",
  //     icon: <CgShutterstock />,
  //     amount: products.length,
  //     bgColor: "bg-yellow-100",
  //     iconColor: "text-yellow-500",
  //   },
  //   {
  //     name: "Top-Selling Products",
  //     icon: <FaTrophy />,
  //     amount: popularProds.length,
  //     bgColor: "bg-blue-100",
  //     iconColor: "text-blue-500",
  //   },
  // ];
  // const orders = [
  //   {
  //     name: "Total Orders",
  //     icon: <AiOutlineOrderedList />,
  //     amount: allOffers && allOffers?.length > 0 ? allOffers.length : 0,
  //     bgColor: "bg-red-100",
  //     iconColor: "text-red-500",
  //   },
  //   {
  //     name: "Approved Orders",
  //     icon: <CheckCheckIcon />,
  //     amount: approved?.length || 0,
  //     bgColor: "bg-green-100",
  //     iconColor: "text-green-500",
  //   },
  //   {
  //     name: "Pending Orders",
  //     icon: <Clock />,
  //     amount: pending?.length || 0,
  //     bgColor: "bg-yellow-100",
  //     iconColor: "text-yellow-500",
  //   },
  //   {
  //     name: "Cancelled Orders",
  //     icon: <Trash />,
  //     amount: "12M+",
  //     bgColor: "bg-red-100",
  //     iconColor: "text-red-500",
  //   },
  // ];
  const ordersData = [
    { province: "Kigali", orders: kigali.length },
    { province: "Southern", orders: south.length },
    { province: "Western", orders: west.length },
    { province: "Northern", orders: north.length },
    { province: "Eastern", orders: east.length },
  ];

  // Chart data and options
  const data = {
    labels: ordersData.map((item) => item.province),
    datasets: [
      {
        label: "Orders",
        data: ordersData.map((item) => item.orders),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Orders by Province in Rwanda",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div>
      <div className="top-0 sticky">
        <Header currentBar="Dashboard" />
      </div>
      <hr />
      <div className="min-h-screen items-center content-center">
        {/* <div className=" gap-5 p-6 flex flex-col sm:flex-row justify-center">
          <div className="max-w-4xl">
            <div className="bg-gray-100 p-5 rounded-lg flex flex-col items-center">
              <h1 className="font-bold text-gray-800 mb-8">Sales Overview</h1>
              <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
                {sales.map((item) => (
                  <div
                    key={item.prodName}
                    className={` flex items-center rounded-lg ${item.bgColor}`}
                  >
                    <div className={`text-4xl p-3 ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-700">
                        {item.prodName}
                      </h2>
                      {loading ? (
                        <Loader3 />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {item.amount}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-4xl">
            <div className="bg-gray-100 p-5 rounded-lg flex flex-col items-center">
              <h1 className="font-bold text-gray-800 mb-8">Orders info</h1>
              <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
                {orders.map((item) => (
                  <div
                    key={item.prodName}
                    className={` flex items-center rounded-lg ${item.bgColor}`}
                  >
                    <div className={`text-4xl p-3 ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-700">
                        {item.prodName}
                      </h2>
                      {loading ? (
                        <Loader3 />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {item.amount}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}
        <div className="gap-6 p-6 flex flex-col sm:flex-row justify-center items-center">
          {/* Users Card */}
          <div className="bg-green-200 max-w-sm cursor-pointer w-full p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h1 className="text-3xl font-bold text-green-800">
              {users.length}
            </h1>
            <h2 className="text-lg text-green-700">Users</h2>
          </div>

          {/* Suppliers Card */}
          <div className="bg-green-500 max-w-sm cursor-pointer w-full p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white">1.2k</h1>
            <h2 className="text-lg text-white">Suppliers</h2>
          </div>

          {/* Team Members Card */}
          <div className="bg-green-200 cursor-pointer max-w-sm w-full p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h1 className="text-3xl font-bold ">10</h1>
            <h2 className="text-lg ">Team members</h2>
          </div>
        </div>

        <div className=" p-6 rounded-lg w-full md:w-3/4 lg:w-2/3 mx-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
            Orders by Area
          </h2>
          {/* Responsive container for the chart */}
          <div className="h-96">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
