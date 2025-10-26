import React from "react";
import TopNav from "../components/TopNav";


const teamMembers = [
  {
    name: "Tushar Bansal",
    role: "Team Leader",
    about:
      "Visionary leader with a knack for structuring ideas into reality. Leads development and ensures our mission stays on track.",
  },
  {
    name: "Tushar Arya",
    role: "Team Memeber",
    about:
      "Passionate about clean UI and smooth UX. Crafts beautiful pages that tell the story of our tiffin service.",
  },
  {
    name: "Tushar Singh",
    role: "Team Memeber",
    about:
      "Bridges the gap between frontend and backend with efficient code and scalable logic. Makes sure features just work!",
  },
  {
    name: "Vartul Arora",
    role: "Team Memeber",
    about:
      "Handles the logic behind the scenes. Focused on data, APIs, and performance optimization.",
  },
];

function Team() {
  return (
    <>
  <TopNav />
    <div className="bg-white min-h-screen px-6 py-16 sm:px-12 md:px-24 lg:px-32 text-zinc-800">
    
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-2">
          Meet the Team
        </h1>
        <p className="text-lg text-zinc-600">
          The brains and hearts behind <span className="font-semibold">Tiffin Tales</span>
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-orange-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-orange-600 font-medium">
                {member.role}
              </p>
              <p className="text-sm text-zinc-600 mt-3">{member.about}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-center">
        <p className="text-zinc-600 text-sm">
          Together, we build more than just a food service — we build a home-cooked experience, powered by tech and care.
        </p>
      </div>
    </div>
    </>
  );
}

export default Team;
