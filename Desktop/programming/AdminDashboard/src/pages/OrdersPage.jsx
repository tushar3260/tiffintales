import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-orange-700">All Orders</h1>
      <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
        {orders.map((order) => (
          <div key={order._id} className="border-b p-2">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
