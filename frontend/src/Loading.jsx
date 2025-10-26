import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-[#fff8ee]/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
      <div className="relative w-16 h-16">
        {/* Outer dashed spinning ring */}
        <div className="absolute inset-0 border-4 border-dashed border-[#ff7e00] rounded-full animate-spin"></div>
        {/* Inner solid circle for design */}
        <div className="absolute inset-2 border-4 border-solid border-white rounded-full"></div>
      </div>

      <p className="mt-4 text-[#ff7e00] font-semibold animate-pulse text-lg">
        {message}
      </p>
    </div>
  );
};

export default Loading;
