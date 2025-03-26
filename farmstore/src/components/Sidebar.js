import React, { useState } from "react";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <span
        className="absolute text-4xl top-5 left-4 cursor-pointer"
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </span>

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-lime-600 duration-500 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <img
              src="26763d481172f5dc599d151570b38ded.jpg"
              className="img-fluid h-8 w-8 rounded-circle"
              alt=""
            />
            <h1 className="font-bold text-gray-200 text-[15px] ml-3">FarmHub</h1>
            <i
              className="fa-solid fa-xmark ml-28 lg:hidden"
              onClick={toggleSidebar}
            ></i>
          </div>
          <div className="my-2 bg-green-900 h-[1px]"></div>
        </div>

        <div className="p-2.5 flex items-center rounded-md px-4 bg-white text-black">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search"
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 hover:bg-lime-700 text-white">
          <i className="fa-solid fa-house"></i>
          <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
        </div>

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 hover:bg-lime-700 text-white">
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="text-[15px] ml-4 text-gray-200 font-bold">Cart</span>
        </div>

        <div className="my-4 bg-green-900 h-[1px]"></div>

        <div
          className="p-2.5 mt-3 flex items-center rounded-md px-4 hover:bg-lime-700 text-white cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="flex justify-between w-full items-center">
            <span className="text-[15px] ml-4 text-gray-200 font-bold">
              Slide Down
            </span>
            <span
              className={`text-sm duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            >
              <i className="fa-solid fa-caret-down"></i>
            </span>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold">
            <h1 className="cursor-pointer p-2 hover:bg-lime-700 rounded-md mt-1">
              Something 1
            </h1>
            <h1 className="cursor-pointer p-2 hover:bg-lime-700 rounded-md mt-1">
              Something 2
            </h1>
            <h1 className="cursor-pointer p-2 hover:bg-lime-700 rounded-md mt-1">
              Something 3
            </h1>
          </div>
        )}

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 hover:bg-lime-700 text-white">
          <span className="text-[15px] ml-4 text-gray-200 font-bold">Something</span>
        </div>
      </div>
    </>
  );
}