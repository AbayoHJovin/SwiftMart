/* eslint-disable react/prop-types */
export default function OrderTable({
  filteredOrders,
  AdminOptions,
  handleOfferClick,
  users,
}) {
  const getStatusBadge = (status, approvalMessage) => {
    let badgeClass = '';
    let badgeText = '';

    switch (status) {
      case 'Pending':
        badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        badgeText = 'Pending';
        break;
      case 'Approved':
        badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        badgeText = 'Approved';
        break;
      case 'ApprovedWithMessage':
        badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 cursor-pointer';
        badgeText = 'Approved with Message';
        break;
      case 'Cancelled':
        badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        badgeText = 'Cancelled';
        break;
      case 'Delivered':
        badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        badgeText = 'Delivered';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        badgeText = status;
    }

    return (
      <div className="relative group">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
          {badgeText}
        </span>
        {approvalMessage && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {approvalMessage}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              {AdminOptions && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Shipping Address
                  </th>
                </>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No orders found for the selected criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders?.map((item) => (
                <tr
                  key={item.orderId}
                  onClick={() => handleOfferClick(item)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{item.orderId.slice(0, 8)}
                  </td>
                  {AdminOptions && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {users.find((user) => user.userId === item.ordererId)?.username || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.address}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.orderItems.length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.orderDate.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.orderDate.split(" ")[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status, item.approvalMessage)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                    RWF {new Intl.NumberFormat("en-US").format(item.price)}
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
