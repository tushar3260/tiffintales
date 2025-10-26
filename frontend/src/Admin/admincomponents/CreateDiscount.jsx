import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateDiscount = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({});

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals`);
        setMeals(res.data);
      } catch (error) {
        console.error("Error fetching meals", error);
      }
    };
    fetchMeals();
  }, []);

  const handleMealSelect = (mealId) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealId]: {
        ...(prev[mealId] || {}),
        selected: !prev[mealId]?.selected,
      },
    }));
  };

  const handleDiscountChange = (mealId, field, value) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealId]: {
        ...(prev[mealId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const mealIds = [];
    const discountValues = [];
    const durationValues = [];

    for (const [mealId, data] of Object.entries(selectedMeals)) {
      if (data.selected && data.discount && data.discountDuration) {
        mealIds.push(mealId);
        discountValues.push(Number(data.discount));
        durationValues.push(Number(data.discountDuration));
      }
    }

    if (mealIds.length === 0) {
      return alert("⚠️ Please select at least one meal with discount and duration.");
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/meals/apply-discount`, {
        mealIds,
        discountValues,
        durationValues,
      });

      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("Error applying discount:", err);
      alert("❌ Failed to apply discount. Check console.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Create Discounts for Meals</h2>

      {meals.length === 0 ? (
        <p className="text-gray-500">Loading meals...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div key={meal._id} className="border p-4 rounded shadow-sm bg-gray-50">
              {meal.photo && (
                <img
                  src={meal.photo}
                  alt={meal.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{meal.title}</h3>
                <input
                  type="checkbox"
                  checked={selectedMeals[meal._id]?.selected || false}
                  onChange={() => handleMealSelect(meal._id)}
                />
              </div>

              <p className="text-sm text-gray-600 mb-2">{meal.description}</p>

              {selectedMeals[meal._id]?.selected && (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Discount %"
                    className="border p-2 rounded focus:outline-none"
                    value={selectedMeals[meal._id]?.discount || ""}
                    onChange={(e) =>
                      handleDiscountChange(meal._id, "discount", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Duration (in days)"
                    className="border p-2 rounded focus:outline-none"
                    value={selectedMeals[meal._id]?.discountDuration || ""}
                    onChange={(e) =>
                      handleDiscountChange(meal._id, "discountDuration", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Apply Discounts
        </button>
      </div>
    </div>
  );
};

export default CreateDiscount;
