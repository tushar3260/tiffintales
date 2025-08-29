import React, { useEffect, useState } from "react";

export default function ChefsPage() {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/chefs")
      .then((res) => res.json())
      .then((data) => setChefs(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-orange-700">All Chefs</h1>
      <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
        {chefs.map((chef) => (
          <div key={chef._id} className="border-b p-2">
            <p className="font-semibold">{chef.name}</p>
            <p className="text-sm text-gray-500">{chef.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


