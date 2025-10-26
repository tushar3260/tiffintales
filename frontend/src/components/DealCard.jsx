import React from "react";


function DealCard({ title, description, buttonText, image, reverse }) {
  return (
    <div className={`flex ${reverse ? 'flex-row-reverse' : ''} bg-white rounded-xl shadow-lg overflow-hidden mb-8`}>
     <img
  src={image}
  alt={title}
  className="w-1/2 h-48 md:h-64 lg:h-80 object-cover"
/>

      <div className="p-8 flex flex-col justify-center w-1/2">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <button className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600">{buttonText}</button>
      </div>
    </div>
  );
}


export default DealCard;