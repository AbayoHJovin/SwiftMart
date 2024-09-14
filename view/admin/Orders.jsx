// import React from 'react';

// const sampleOrders = [
//   { id: 1, product: 'User 1', status: 'Delivered',date:"9-9-2022",time:"14:30 PM" },
//   { id: 2, product: 'User 1', status: 'Pending',date:"9-9-2022",time:"14:30 PM" },
//   { id: 3, product: 'User 1', status: 'Shipped',date:"9-9-2022",time:"14:30 PM" },
//   { id: 4, product: 'User 1', status: 'Cancelled',date:"9-9-2022",time:"14:30 PM" },
// ];

// const Orders = () => {
//   return (
//     <div className="flex flex-col p-4 space-y-4">
//       <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
//       <div className="space-y-2">
//         {sampleOrders.map((order) => (
//           <div
//             key={order.id}
//             className="flex justify-between items-center p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition duration-200"
//           >
//             <div className="flex flex-col">
//               <span className="text-lg font-medium">{order.product}</span>
//               <span className={`text-sm ${order.status === 'Delivered' ? 'text-green-500' : order.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
//                 {order.status}
//               </span>
//             </div>
//             <button className="text-blue-500 hover:underline">View</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React from "react";

const ordersData = [
  { id: 1, item: "Order 1", date: "2024-09-01" },
  { id: 2, item: "Order 2", date: "2024-09-05" },
  { id: 3, item: "Order 3", date: "2024-09-10" },
  // Add more orders as needed
];

const Orders = () => {
  return (
    <div className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Your Orders</h2>
      <div className="bg-white shadow-md rounded-lg">
        {ordersData.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border-b p-4 last:border-b-0 hover:bg-gray-100 transition duration-200"
          >
            <div>
              <p className="text-lg font-medium text-gray-900">{order.item}</p>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>
            <button className="text-blue-600 hover:underline">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
