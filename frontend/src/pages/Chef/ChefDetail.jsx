import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChefDetail = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/chefs/public/getChefById/${id}`)

      .then((res) => res.json())
      .then((data) => setChef(data))
      .catch((err) => console.error("Error fetching chef details:", err));
  }, [id]);

  if (!chef) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-orange-700 mb-4">{chef.name}</h1>
      <p className="text-gray-800 mb-2"><strong>Email:</strong> {chef.email}</p>
      <p className="text-gray-800 mb-2"><strong>Phone:</strong> {chef.phone}</p>
      <p className="text-gray-800 mb-2"><strong>Location:</strong> {chef.location?.area}, {chef.location?.city}</p>
      <p className="text-gray-800 mb-2"><strong>Cuisines:</strong> {chef.cuisine?.join(", ")}</p>
      <p className="text-gray-800 mb-2"><strong>Bio:</strong> {chef.bio || "No bio available."}</p>
      <p className="text-gray-800 mb-2"><strong>Documents:</strong> {chef.documents?.length || 0} uploaded</p>
      {/* Add more fields as needed, excluding ifsc, accountHolderName, and image */}
    </div>
  );
};

export default ChefDetail;
