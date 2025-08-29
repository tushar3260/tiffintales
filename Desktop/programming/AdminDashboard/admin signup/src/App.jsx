import { useState } from "react";
import axios from "axios";

export default function AdminSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admins/register", { username, password });
      alert("Signup successful");
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Signup failed: " + err.response.data.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Signup</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
