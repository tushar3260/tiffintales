import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { storage } from "../utils/Storage";

export default function AdminAlladmin() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = storage.getItem("AdminToken");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admins/getAllAdmins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(res.data);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError(err.response?.data?.message || "Failed to fetch admins");
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 p-6">
      <motion.h2
        className="text-3xl font-bold text-orange-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        All Admins
      </motion.h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Username</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No admins found.
                </td>
              </tr>
            ) : (
              admins.map((admin, index) => (
                <tr key={admin._id} className="border-b hover:bg-yellow-100 transition">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{admin.username}</td>
                  <td className="p-3">{admin.role}</td>
                  <td className="p-3">{new Date(admin.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
