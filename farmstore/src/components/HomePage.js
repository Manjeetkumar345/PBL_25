import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";
import Carousel from "./Carousel";

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});

  useEffect(() => {
    // Fetch the store.json file from the public directory
    fetch("/Images/store.json")
      .then((response) => response.json())
      .then((data) => {
        // Process the data to group by category and limit to 5 items per category
        const groupedData = {};

        Object.keys(data).forEach((category) => {
          groupedData[category] = data[category].slice(0, 5); // Limit to 5 items
        });

        setCategories(groupedData);
      })
      .catch((error) => console.error("Error fetching store data:", error));
  }, []);

  // Handle navigation to category page
  const handleCategoryClick = (category) => {
    localStorage.setItem("selectedCategory", category); // Save category to localStorage
    navigate("/productcategory"); // Navigate without passing state
  };

  return (
    <div className="min-h-screen flex flex-col">
  {/* Carousel */}
  <Carousel />

  {/* HomePage Content */}
  <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
    <div className="space-y-6">
      {Object.entries(categories).map(([category, items]) => (
        <div
          key={category}
          className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
          onClick={() => handleCategoryClick(category)}
        >
          {/* Category Name (Above Images on Mobile) */}
          <div className="p-4 bg-green-100 rounded-t-lg sm:hidden">
            <p className="text-2xl font-bold text-green-800 text-center">
              {category}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row h-64">
            {/* Category Name (Side on Larger Screens) */}
            <div className="hidden sm:flex w-1/4 items-center justify-center border-r border-green-300 bg-green-100 rounded-l-lg">
              <p className="text-2xl font-bold text-green-800">{category}</p>
            </div>

            {/* Product Container */}
            <div className="w-full sm:w-3/4 flex space-x-4 p-4 overflow-x-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center bg-green-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 min-w-[220px]"
                >
                  <img
                    src={`/Images/${category}/${item.imageAddress.split("/").pop()}`}
                    alt={item.productName}
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-md"
                  />
                  <p className="mt-2 text-lg font-medium text-green-800">
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