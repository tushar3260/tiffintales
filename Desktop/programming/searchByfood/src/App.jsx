import React, { useRef } from "react";

const foodItems = [
  { label: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emF8ZW58MHx8MHx8fDA%3D" },
  { label: "Burger", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVyZ2VyfGVufDB8fDB8fHww" },
  { label: "Noodles", image:"https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9vZGxlfGVufDB8fDB8fHww" },
  { label: "Sub-sandiwich", image: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FuZHdpdGNofGVufDB8fDB8fHww" },
  { label: "Chowmein", image: "https://media.istockphoto.com/id/2204824459/photo/a-vibrant-plate-of-stir-fried-noodles-with-vegetables-topped-with-fresh-cilantro-rests-on-a.webp?a=1&b=1&s=612x612&w=0&k=20&c=JBdvbDXsMZgRh-tjDak2Gvm3Qnrg4ll1wRXZCJTL-kw=" },
  { label: "Aaloo-paratha", image: "https://media.istockphoto.com/id/1418692758/photo/north-indian-famous-food-aloo-paratha-with-mango-pickle-and-butter.webp?a=1&b=1&s=612x612&w=0&k=20&c=Rq02SWwsR23m-mYUHW8_hjS89sl4PdJmzrSNqjKFsKg=" },
 { label: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emF8ZW58MHx8MHx8fDA%3D" },
  { label: "Burger", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVyZ2VyfGVufDB8fDB8fHww" },
  { label: "Noodles", image:"https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9vZGxlfGVufDB8fDB8fHww" },
  { label: "Sub-sandiwich", image: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FuZHdpdGNofGVufDB8fDB8fHww" },
  { label: "Chowmein", image: "https://media.istockphoto.com/id/2204824459/photo/a-vibrant-plate-of-stir-fried-noodles-with-vegetables-topped-with-fresh-cilantro-rests-on-a.webp?a=1&b=1&s=612x612&w=0&k=20&c=JBdvbDXsMZgRh-tjDak2Gvm3Qnrg4ll1wRXZCJTL-kw=" },
  { label: "Aaloo-paratha", image: "https://media.istockphoto.com/id/1418692758/photo/north-indian-famous-food-aloo-paratha-with-mango-pickle-and-butter.webp?a=1&b=1&s=612x612&w=0&k=20&c=Rq02SWwsR23m-mYUHW8_hjS89sl4PdJmzrSNqjKFsKg=" },
 
];

export default function FoodCategorySlider() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      current.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#FFF8EF] py-14 px-6 w-full">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Search by Food</h2>
          <div className="flex items-center gap-2 text-orange-500 font-semibold">
            <a href="#" className="hover:underline">View All</a>
            <button
              onClick={() => scroll("left")}
              className="h-10 w-10 rounded-full bg-orange-400 text-white shadow-lg"
            >
              ❮
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-full bg-orange-400 text-white shadow-lg"
            >
              ❯
            </button>
          </div>
        </div>

        {/* Scrollable List */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-2 scroll-smooth">
          {foodItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center min-w-[80px]">
              <img
                src={item.image}
                alt={item.label}
                className="h-24 w-24 rounded-full object-cover shadow-md"
              />
              <p className="mt-2 font-semibold text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}