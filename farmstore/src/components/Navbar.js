import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";


export default function Navbar() {
  const { role } = JSON.parse(sessionStorage.getItem("user") || "{}");
  const location = useLocation();
  

  // Hide search bar and language when on login or signup page
  const hideSearch =
    location.pathname === "/login" || location.pathname === "/SignIN";

  const handleLogout = ()=>{
  sessionStorage.removeItem("user");
  window.location.href = "/login";   // 👈 redirect user after logout


  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-green-600 shadow-md">
      {/* Top Section */}
      {!hideSearch && (
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-white">
          {/* Language Dropdown */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-transform duration-300 hover:scale-105">
            <span className="font-semibold tracking-wide">🌐 Language</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="flex overflow-hidden rounded-full shadow-md border border-green-300 focus-within:ring-2 focus-within:ring-yellow-400 transition">
              <select className="w-[140px] bg-green-100 text-green-800 px-3 py-2 border-r border-green-300 outline-none">
                <option value="all">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
              </select>
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="w-full px-4 py-2 text-gray-800 focus:outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-300 hover:scale-105 active:scale-95 rounded-r-full">
                  <svg
                    className="h-5 w-5 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Login / Signup Buttons */}
          <div className="flex items-center gap-3">
            {sessionStorage.getItem('user') === null ?
            <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-green-700 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Login
            </Link>
            <Link
              to="/SignIN"
              className="px-4 py-2 rounded-full border border-yellow-300 bg-yellow-400 text-green-900 hover:bg-yellow-500 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
              Sign Up
            </Link>
            </>
            :
            <div
              className="px-4 py-2 rounded-full border border-yellow-300 bg-yellow-400 text-green-900 hover:bg-yellow-500 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              onClick={handleLogout}
            >
              Logout
              </div>
      }
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="bg-white border-t border-green-100 shadow-inner">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-3 gap-8 text-gray-700 font-medium tracking-wide relative">
            {[
              { name: "Home", link: "/" },
              role === "seller"
                ? { name: "Seller Dashboard", link: "/seller" }
                : { name: "Shipping", link: "/shipping" },
              { name: "Services", link: "/services" },
              { name: "Deals", link: "/deals" },
              { name: "Cart", link: "/cart" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="relative hover:text-green-700 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <div className="relative">
              <Notification/>
  
             </div>
           
          </div>
        </div>
      </nav>
    </header>
  );
}

const Notification = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [messages, setMessages] = useState([]);
  const [badgeVisible, setBadgeVisible] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = user?.id;
  const sentBy = user?.role; // 'seller' or 'buyer'

  useEffect(() => {
    if (!userId || !sentBy) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8001/api/negotiate/recnotification",
          { id: userId, sentBy }
        );

        if (Array.isArray(res.data) && res.data.length > 0) {
          setMessages(res.data);
          setBadgeVisible(true);

          setTimeout(() => {
            setBadgeVisible(false);
          }, 5000);
        }
      } catch (err) {
        console.log("Notification error:", err);
      }
    };

    fetchNotifications();
  }, [userId, sentBy]);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    setBadgeVisible(false); // Client side only now
  };

  return (
    <div className="relative">
      <button onClick={handleBellClick} className="relative p-2">
        <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 00-4-6V5a2 2 0 10-4 0v.3A6 6 0 006 11v3c0 .3-.1.7-.4 1L4 17h5m6 0v1a3 3 0 11-6 0v-1"/>
        </svg>

        {badgeVisible && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {messages.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg border z-50 max-h-64 overflow-y-auto">
          <div className="px-4 py-2 bg-green-200 font-semibold">Notifications</div>

          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} className="px-4 py-2 border-b text-sm">
                {sentBy === "seller"
                  ? <>New request from <b>{msg.buyerId?.name}</b></>
                  : <>Response from <b>{msg.sellerId?.name}</b></>}
                <br />
                <span className="text-xs text-gray-600">
                  Status: {msg.negotiationId?.status}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">No new notifications</div>
          )}
        </div>
      )}
    </div>
  );
};



// new notification or not use it via useeffect 

// on click on bell show the message ;- (buyer )person name and what buyer did - if reofferd how much , matched fine rejected ok ,

// on Click on bell show the message :- (seller) buyer name and 
// what he did like reoff,matched or rejected,


// buyer sent negotiation amount 

// for buyer in offer matched item saved to cart (of buyer) for that price
// rejected nothing can re offer as usual

// after the seller's re offer 
// (buyer)itm to cart showing range so that they can re negotiate on that item

// during renegotiating if the negotiation fails item out of cart



// When payment is done remove that element to that's Id was in negotiations with seller ,buyer and product Id



