import React from "react";

const CustomTable = () => {
  const data = [
    { name: "John Doe", email: "john@example.com", role: "Admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 rounded-lg shadow-md p-4">
        <div className="grid grid-cols-3 gap-6">
          <div className="font-bold text-gray-600">Name</div>
          <div className="font-bold text-gray-600">Email</div>
          <div className="font-bold text-gray-600">Role</div>
        </div>
        <div className="mt-4 space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-6 bg-white rounded-lg shadow-sm p-4"
            >
              <div className="text-gray-700">{item.name}</div>
              <div className="text-gray-700">{item.email}</div>
              <div className="text-gray-700">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
