import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useChef } from "../Context/ChefContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaTimes, FaTrash, FaEdit } from "react-icons/fa";

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const allSlots = ["Breakfast", "Lunch", "Dinner"];

const ChefMeals = () => {
  const { chef } = useChef();
  const chefId = chef?._id;

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    chefId: "",
    title: "",
    description: "",
    price: "",
    photo: "",
    availableDays: [],
    timeSlots: [],
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ Handle Checkbox & Input Changes
  const handleCheckbox = (name, value, checked) => {
    setFormData((prev) => {
      const arr = new Set(prev[name] ?? []);
      checked ? arr.add(value) : arr.delete(value);
      return { ...prev, [name]: Array.from(arr) };
    });
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "availableDays" || name === "timeSlots") {
      handleCheckbox(name, value, checked);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearForm = () => {
    setFormData({
      chefId: chef?._id || "",
      title: "",
      description: "",
      price: "",
      photo: "",
      availableDays: [],
      timeSlots: [],
    });
    setEditId(null);
  };

  // ✅ Normalize Data
  const normalizeMeals = (data) =>
    data.map((m) => ({
      ...m,
      availableDays: Array.isArray(m.availableDays)
        ? m.availableDays
        : typeof m.availableDays === "string"
        ? m.availableDays.split(",").map((x) => x.trim())
        : [],
      timeSlots: Array.isArray(m.timeSlots)
        ? m.timeSlots
        : typeof m.timeSlots === "string"
        ? m.timeSlots.split(",").map((x) => x.trim())
        : [],
    }));

  // ✅ Fetch Meals
  const fetchMeals = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/meals/chef/${id}`
      );
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.meals || [];
      setMeals(normalizeMeals(data));
    } catch (err) {
      toast.error("Failed to fetch meals");
      setError("Error fetching meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chefId) {
      setFormData((prev) => ({ ...prev, chefId }));
      fetchMeals(chefId);
    }
  }, [chefId]);

  // ✅ Add or Edit Meal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, price, photo, availableDays, timeSlots } =
      formData;

    if (
      !title ||
      !description ||
      !price ||
      !photo ||
      !availableDays.length ||
      !timeSlots.length
    )
      return toast.error("Please fill all fields!");

    const payload = {
      ...formData,
      price: Number(price),
      availableDays: Array.from(new Set(availableDays)),
      timeSlots: Array.from(new Set(timeSlots)),
    };

    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/meals/${editId}`,
          payload
        );
        setMeals((prev) =>
          prev.map((m) => (m._id === editId ? res.data : m))
        );
        toast.success("Meal updated successfully!");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/meals/create`,
          payload
        );
        setMeals((prev) => [res.data, ...prev]);
        toast.success("Meal added!");
      }
      clearForm();
      setShowForm(false);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  // ✅ Edit / Delete
  const handleEdit = (meal) => {
    setFormData({
      chefId: meal.chefId?._id || meal.chefId || "",
      title: meal.title,
      description: meal.description,
      price: meal.price,
      photo: meal.photo,
      availableDays: meal.availableDays || [],
      timeSlots: meal.timeSlots || [],
    });
    setEditId(meal._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/meals/${id}`);
      setMeals((prev) => prev.filter((m) => m._id !== id));
      toast.success("Meal deleted!");
    } catch {
      toast.error("Failed to delete meal");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          🍽️ Manage Your Meals
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
        >
          {showForm ? <FaTimes /> : <FaPlusCircle />}{" "}
          {showForm ? "Close" : "Add Meal"}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-orange-100 mb-10 space-y-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Meal Title"
                value={formData.title}
                onChange={handleChange}
                className="border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="url"
              name="photo"
              placeholder="Photo URL"
              value={formData.photo}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400"
            />

            {formData.photo && (
              <img
                src={formData.photo}
                alt="Preview"
                className="h-36 w-auto rounded-md shadow mx-auto"
              />
            )}

            <div className="flex flex-wrap gap-4">
              <div>
                <p className="font-semibold mb-2">Available Days:</p>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day) => (
                    <label key={day} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="availableDays"
                        value={day}
                        checked={formData.availableDays.includes(day)}
                        onChange={handleChange}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Time Slots:</p>
                <div className="flex flex-wrap gap-2">
                  {allSlots.map((slot) => (
                    <label key={slot} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="timeSlots"
                        value={slot}
                        checked={formData.timeSlots.includes(slot)}
                        onChange={handleChange}
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              {editId ? "Update Meal" : "Add Meal"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="h-60 bg-gray-200 animate-pulse rounded-xl"
              ></div>
            ))
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : meals.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            🚫 No meals found. Add some!
          </div>
        ) : (
          meals.map((meal) => (
            <motion.div
              key={meal._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={meal.photo}
                alt={meal.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-bold text-gray-800">
                  {meal.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {meal.description}
                </p>
                <p className="font-semibold text-orange-600">
                  ₹{meal.price}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Days:</span>{" "}
                  {meal.availableDays?.join(", ") || "—"}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Time:</span>{" "}
                  {meal.timeSlots?.join(", ") || "—"}
                </p>
                <div className="flex justify-between items-center pt-3">
                  <button
                    onClick={() => handleEdit(meal)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChefMeals;
