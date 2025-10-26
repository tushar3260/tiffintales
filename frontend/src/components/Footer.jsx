import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaYoutube } from "react-icons/fa";



function Footer() {
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      navigate(path);
    }, 500); // 0.5 seconds
  };

  const handleExternal = (url) => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      window.open(url, "_blank");
    }, 500);
  };

  return (
    <div>
      {/* Loader */}
      {showLoader && (
        <div className="fixed inset-0 bg-orange-100 bg-opacity-90 flex items-center justify-center z-[9999]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* Footer Starts */}
      <footer className="bg-zinc-900 text-white px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm mb-8">
          <div>
            <h4 className="font-bold mb-2">Top Areas in Mathura</h4>
            <ul>
              <li>Mathura City</li>
              <li>Vrindavan</li>
              <li>Chaumhuna</li>
              <li>Govardhan</li>
              <li>Barsana</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>GLA University</li>
              <li>Chhata</li>
              <li>Kosi Kalan</li>
              <li>Naujheel</li>
              <li>Gokul</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>Raya</li>
              <li>Radhakund</li>
              <li>Township</li>
              <li>Farah</li>
              <li>Mahavan</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>Jait</li>
              <li>Jamunavata</li>
              <li>Shahpur</li>
              <li>Jaisinghpura</li>
              <li>Chhatikara</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>Tanki Chowk</li>
              <li>Masani</li>
              <li>Dampier Nagar</li>
              <li>Chhata Rural</li>
              <li>Yamuna Expressway Area</li>
            </ul>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-zinc-700 pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-2">Company</h4>
            <ul>
              <li onClick={() => handleNavigate("/aboutus")} className="hover:underline cursor-pointer">About us</li>
              <li onClick={() => handleNavigate("/team")} className="hover:underline cursor-pointer">Team</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Contact</h4>
            <ul>
              <li onClick={() => handleNavigate("/help")} className="hover:underline cursor-pointer">Help & Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Legal</h4>
            <ul>
              <li onClick={() => handleNavigate("/terms")} className="hover:underline cursor-pointer">Terms & Conditions</li>

              <li onClick={() => handleNavigate("/refund")} className="hover:underline">Refund & Cancellation</li>
              
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-bold">Follow Us</h4>
              <button onClick={() => handleExternal("https://www.instagram.com/ts3231442")} className="text-xl hover:text-pink-500">
                <FaInstagram />
              </button>
              <button onClick={() => handleExternal("https://youtube.com/@tiffintales-z3x?si=0nphfnChs5QZtLjE")} className="text-xl hover:text-red-500">
                <FaYoutube />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold mb-1">Receive exclusive offers in your mailbox</p>
              <div className="flex items-center">
                <input type="email" placeholder="Enter Your email" className="bg-zinc-800 px-4 py-2 rounded-l w-full outline-none" />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-xs text-zinc-500 border-t border-zinc-700 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p>All rights Reserved © <span className="text-white font-semibold">Tiffin Tales, 2025</span></p>
          <p>Made with <span className="text-yellow-500">❤</span> by <span className="text-white">Tiffin Tales</span></p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
