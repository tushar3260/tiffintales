import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { useUser } from "../../context/userContext";

export default function Charts() {
  const { user } = useUser();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/${user._id}`
        );

        const orders = res.data || [];

        // Day-wise order count (Mon-Sun)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayCounts = Array(7).fill(0);

        orders.forEach((order) => {
          const dayIndex = new Date(order.createdAt).getDay(); // 0=Sun,1=Mon
          dayCounts[dayIndex] += 1;
        });

        // Rearrange to start from Mon (like chart)
        const arrangedLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const arrangedData = [
          dayCounts[1],
          dayCounts[2],
          dayCounts[3],
          dayCounts[4],
          dayCounts[5],
          dayCounts[6],
          dayCounts[0],
        ];

        setChartData({
          labels: arrangedLabels,
          datasets: [
            {
              label: "Weekly Orders",
              data: arrangedData,
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "#10B981",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#10B981",
              pointRadius: 5,
            },
          ],
        });
      } catch {
        // silent — chart simply won't render
      }
    };

    fetchOrders();
  }, [user?._id]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen"
    >
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-md text-white mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Order Analytics</h1>
        <p className="text-sm opacity-90 mt-1">Your weekly meal ordering patterns</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold mb-4 text-base text-gray-800">Weekly Order Activity</h2>
        <div className="w-full h-72">
          {chartData ? <Line data={chartData} options={options} /> : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
