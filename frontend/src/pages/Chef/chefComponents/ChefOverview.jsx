import React, { useEffect, useState, useCallback } from "react";
import StatsCard from "./StatsCard";
import OrderCard from "./OrderCard";
import MessageCard from "./MessageCard";
import { FaClipboardList, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { useChef } from "../Context/ChefContext";

// Utility: Format currency in INR
const formatINR = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const ChefOverview = () => {
  const { chef } = useChef();
  const chefId = chef?._id;

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Choose calculation type: "paid" for actual earnings, "expected" for pipeline revenue
  const CALCULATION_MODE = "paid"; // change to "expected" if needed

  const fetchOverviewData = useCallback(async () => {
    if (!chefId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/chef/${chefId}`
      );

      const orders = Array.isArray(res.data)
        ? res.data
        : res.data?.orders || [];

      console.log("Orders fetched:", orders);

      // ✅ Total Orders
      const ordersCount = orders.length;

      // ✅ Total Earnings logic
      let earnings = 0;

      if (CALCULATION_MODE === "paid") {
        // Real earnings: only count if paymentStatus = "Paid"
        earnings = orders
          .filter((o) => o.paymentStatus?.toLowerCase() === "paid")
          .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
      } else {
        // Expected revenue: all non-cancelled orders
        earnings = orders
          .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
          .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
      }

      setTotalOrders(ordersCount);
      setTotalEarnings(earnings);
    } catch (err) {
      console.error("❌ Error fetching overview data:", err);
    } finally {
      setLoading(false);
    }
  }, [chefId]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  // ✅ Optional: Polling every 30s for real-time updates
  useEffect(() => {
    if (!chefId) return;
    const interval = setInterval(fetchOverviewData, 30000);
    return () => clearInterval(interval);
  }, [chefId, fetchOverviewData]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatsCard
          icon={FaClipboardList}
          label="Total Orders"
          value={loading ? "..." : totalOrders}
        />
        <StatsCard
          icon={FaDollarSign}
          label="Total Earnings"
          value={loading ? "..." : formatINR(totalEarnings)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderCard onOrderUpdated={fetchOverviewData} />
        <MessageCard />
      </div>
    </>
  );
};

export default ChefOverview;
