/* eslint-disable react/prop-types */
// import PropTypes from "prop-types"
// OrderTable.propTypes = {
//     filteredOrders: PropTypes.arrayOf(
//       PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         customer: PropTypes.string.isRequired,
//         status: PropTypes.string.isRequired,
//       })
//     ).isRequired,
//     AdminOptions: PropTypes.bool.isRequired,
//   };
export default function OrderTable({
  filteredOrders,
  AdminOptions,
  handleOfferClick,
  users,
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="rounded-full">
            <tr className="bg-white dark:bg-gray-800 uppercase text-sm border border-gray-200">
              <th className="p-4 text-left text-sm font-semibold  text-black dark:text-gray-200">
                No
              </th>
              {AdminOptions && (
                <th className="p-4 text-left text-sm font-semibold  text-black dark:text-gray-200">
                  Name
                </th>
              )}
              {AdminOptions && (
                <th className="p-4 text-left text-sm font-semibold text-black dark:text-gray-200">
                  Address
                </th>
              )}
              <th className="p-4 text-left text-sm font-semibold text-black dark:text-gray-200">
                Number of products
              </th>
              <th className="p-4 text-left text-sm font-semibold text-black dark:text-gray-200">
                Date
              </th>
              <th className="p-4 text-left text-sm font-semibold text-black dark:text-gray-200">
                Time
              </th>
              <th className="p-4 text-left text-sm font-semibold text-black dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-gray-200 border border-gray-200">
            {filteredOrders?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center content-center p-4 border-b text-sm truncate"
                >
                  No orders available on the selected date
                </td>
              </tr>
            ) : (
              filteredOrders?.map((item, index) => (
                <tr
                  onClick={() => handleOfferClick(item)}
                  key={item.index}
                  className={`border-b-2 p-5 border-gray-200 cursor-pointer items-center content-center text-left ${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 hover:text-black"
                      : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <td>{index + 1}</td>
                  {AdminOptions && (
                    <td>
                      {users.find((u) => u.userId === item.ordererId)?.username}
                    </td>
                  )}
                  {AdminOptions && (
                    <td className="p-4 text-sm  dark:text-gray-200  truncate">
                      {item.address}
                    </td>
                  )}
                  <td className="p-4 text-sm  dark:text-gray-200  truncate">
                    {item.orderItems?.length}
                  </td>
                  <td className="p-4 text-sm dark:text-gray-200  truncate">
                    {item.orderDate.split(" ")[0]}
                  </td>
                  <td className="p-4 text-sm   dark:text-gray-200 truncate">
                    {item.orderDate.split(" ")[1]}
                  </td>
                  <td className="p-4 text-sm  dark:text-gray-200 truncate rounded-r-md">
                    {item.approved ? "Approved" : "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
