import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { storage } from "../../utils/Storage";

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Users fetch karne ka function
  const fetchUsers = async () => {
    try {
      const token = await storage.getItem("AdminToken"); // await lagaya
      console.log("Admin Token:", token);

      if (!token) {
        console.error("Admin token missing");
        alert("Please login again!");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getallusers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Block/Unblock toggle
  const toggleBlock = async (id) => {
    try {
      const token = await storage.getItem("AdminToken"); // await lagaya
      const user = users.find((u) => u._id === id);
      const newStatus = !user.isBlocked;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/user/toggleBlock/${id}`,
        { isBlocked: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error("Error toggling block status", error);
      alert("Failed to update user status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 p-6">
      <motion.h2
        className="text-3xl font-bold text-orange-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        All Registered Users
      </motion.h2>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-yellow-100 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.fullName || user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">
                    {user.isBlocked ? (
                      <span className="text-red-600 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white px-4 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold"
                    >
                      👁 View
                    </button>

                    <button
                      onClick={() => toggleBlock(user._id)}
                      className={`${
                        user.isBlocked ? "bg-green-600" : "bg-red-600"
                      } hover:opacity-90 text-white px-3 py-1 rounded shadow`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-xl shadow-xl relative">
            <h3 className="text-2xl font-bold mb-4 text-orange-700">
              User Details
            </h3>
            <p><strong>Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={selectedUser.isBlocked ? "text-red-600" : "text-green-600"}>
                {selectedUser.isBlocked ? "Blocked" : "Active"}
              </span>
            </p>

            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2 text-orange-600">
                Addresses:
              </h4>
              {selectedUser.address?.length > 0 ? (
                selectedUser.address.map((addr, idx) => (
                  <div key={idx} className="bg-orange-100 p-3 rounded mb-2 shadow-sm">
                    <p><strong>Street:</strong> {addr.street}</p>
                    <p><strong>City:</strong> {addr.city}</p>
                    <p><strong>Pincode:</strong> {addr.pincode}</p>
                    <p><strong>Tag:</strong> {addr.tag}</p>
                    <p><strong>Added On:</strong> {new Date(addr.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No address found.</p>
              )}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-3 text-red-600 hover:scale-110 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
