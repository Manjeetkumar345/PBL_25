import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";
import Carousel from "./Carousel";

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetch("/Images/store.json")
      .then((response) => response.json())
      .then((data) => {
        const groupedData = {};
        Object.keys(data).forEach((category) => {
          groupedData[category] = data[category].slice(0, 5);
        });
        setCategories(groupedData);
      })
      .catch((error) => console.error("Error fetching store data:", error));
  }, []);

  const handleCategoryClick = (category) => {
    localStorage.setItem("selectedCategory", category);
    navigate("/productcategory");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Carousel */}
      <Carousel />

      {/* HomePage Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="space-y-8">
          {Object.entries(categories).map(([category, items]) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => handleCategoryClick(category)}
            >
              {/* Category Name (Mobile) */}
              <div className="p-4 bg-green-100 rounded-t-lg sm:hidden">
                <p className="text-2xl font-bold text-green-800 text-center animate-fadeIn">
                  {category}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row h-64">
                {/* Category Name (Desktop) */}
                <div className="hidden sm:flex w-1/4 items-center justify-center border-r border-green-300 bg-green-100 rounded-l-lg animate-fadeIn">
                  <p className="text-2xl font-bold text-green-800">{category}</p>
                </div>

                {/* Product Container */}
                <div className="w-full sm:w-3/4 flex space-x-4 p-4 overflow-x-auto scroll-smooth hide-scrollbar">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center bg-green-200 rounded-lg p-4 shadow-md transform transition duration-500 hover:shadow-xl hover:scale-105 min-w-[220px] animate-fadeIn "
                    >
                      <img
                        src={`/Images/${category}/${item.imageAddress.split("/").pop()}`}
                        alt={item.productName}
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-md transform transition duration-500 hover:scale-110"
                      />
                      <p className="mt-2 text-lg font-medium text-green-800 text-center">
                        {item.productName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;