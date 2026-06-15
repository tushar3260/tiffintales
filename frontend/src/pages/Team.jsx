import React from "react";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const teamMembers = [
  {
    name:  "Tushar Bansal",
    role:  "Team Leader",
    initials: "TB",
    gradient: "from-orange-400 to-red-500",
    about: "Visionary leader with a knack for structuring ideas into reality. Leads development and ensures our mission stays on track.",
    skills: ["Leadership", "Architecture", "Strategy"],
  },
  {
    name:  "Tushar Arya",
    role:  "Frontend Developer",
    initials: "TA",
    gradient: "from-violet-400 to-purple-600",
    about: "Passionate about clean UI and smooth UX. Crafts beautiful pages that tell the story of our tiffin service.",
    skills: ["React", "UI/UX", "Animation"],
  },
  {
    name:  "Tushar Singh",
    role:  "Full-Stack Developer",
    initials: "TS",
    gradient: "from-emerald-400 to-teal-600",
    about: "Bridges the gap between frontend and backend with efficient code and scalable logic. Makes sure features just work!",
    skills: ["Node.js", "APIs", "Integration"],
  },
  {
    name:  "Vartul Arora",
    role:  "Backend Developer",
    initials: "VA",
    gradient: "from-blue-400 to-indigo-600",
    about: "Handles the logic behind the scenes. Focused on data, APIs, and performance optimization.",
    skills: ["Node.js", "MongoDB", "Performance"],
  },
];

function Team() {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gray-50">

        {/* Hero Header */}
        <div className="bg-white border-b border-gray-100 pt-24 pb-14">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-5">
                Our Team
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                The People Behind<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Tiffin Tales
                </span>
              </h1>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                A passionate team building technology that connects home chefs with food lovers across India.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
              >
                {/* Top Gradient Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${member.gradient}`} />

                <div className="p-6 text-center">
                  {/* Avatar */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                    {member.initials}
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-base font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold text-orange-500 mb-3 uppercase tracking-wide">{member.role}</p>

                  {/* About */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{member.about}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
          >
            <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed">
              Together, we build more than just a food service — we build a home-cooked experience,
              powered by technology and driven by passion.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Team;
