import React from "react";

function App() {
  return (
    <div>
      <footer className="bg-zinc-900 text-white px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm mb-8">
          <div>
            <h4 className="font-bold mb-2">Our top cities</h4>
            <ul>
              <li>San Francisco</li>
              <li>Miami</li>
              <li>San Diego</li>
              <li>East Bay</li>
              <li>Long Beach</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>Los Angeles</li>
              <li>Washington DC</li>
              <li>Seattle</li>
              <li>Portland</li>
              <li>Nashville</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>New York City</li>
              <li>Orange County</li>
              <li>Atlanta</li>
              <li>Charlotte</li>
              <li>Denver</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>Chicago</li>
              <li>Phoenix</li>
              <li>Las Vegas</li>
              <li>Sacramento</li>
              <li>Oklahoma City</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 sm:mt-8">
              <li>Columbus</li>
              <li>New Mexico</li>
              <li>Albuquerque</li>
              <li>Sacramento</li>
              <li>New Orleans</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-700 pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-2">Company</h4>
            <ul>
              <li><a href="#" className="hover:underline">About us</a></li>
              <li><a href="#" className="hover:underline">Team</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Contact</h4>
            <ul>
              <li><a href="#" className="hover:underline">Help & Support</a></li>
              <li><a href="#" className="hover:underline">Partner with us</a></li>
              <li><a href="#" className="hover:underline">Ride with us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Legal</h4>
            <ul>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Refund & Cancellation</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-3 text-lg">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold mb-1">Receive exclusive offers in your mailbox</p>
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Enter Your email"
                  className="bg-zinc-800 px-4 py-2 rounded-l w-full outline-none"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500 border-t border-zinc-700 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p>
            All rights Reserved © <span className="text-white font-semibold">Your Company, 2021</span>
          </p>
          <p>
            Made with <span className="text-yellow-500">❤</span> by <span className="text-white">Tiffin Tales</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;