import React, { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users") // ✅ Make sure this matches your backend route
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-orange-700">All Users</h1>
      <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
        {users.map((user) => (
          <div key={user._id} className="border-b p-2">
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function UsersPage() {
  return <div className="p-6 text-2xl">👤 All Users Displayed Here</div>;
}
