import React, { useState, useEffect } from "react";
import "../CSS/ProductCat.css";
import Sidebar from "./Sidebar";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";

export default function ProductCat() {
  const [data, setData] = useState([]); // All product data
  const [filteredData, setFilteredData] = useState([]); // Filtered products
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch("/Images/store.json"); // Adjust path as needed
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOneItem = (item) => {
    console.log(item);
    localStorage.setItem("selectedItem", JSON.stringify({
      category: localStorage.getItem("selectedCategory"),
      productName: item.productName,
      // Include other necessary fields for the itemType page
      ...item
    }));
    navigate("/itemType"); // Navigate to the item details page
  };

  useEffect(() => {
    const selectedCategory = localStorage.getItem("selectedCategory");
    
    if (selectedCategory && data && data[selectedCategory]) {
      const filtered = Array.isArray(data[selectedCategory]) 
        ? data[selectedCategory] 
        : [];
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [data]);

  return (
    <>
      <Carousel />
      <Sidebar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          {localStorage.getItem("selectedCategory") || "Products"}
        </h2>
        {filteredData.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => handleOneItem(item)}
              >
                <div className="relative">
                  <img
                    src={item.imageAddress || "/Img/Watermelon.jpg"} // Use imageAddress from store.json
                    alt={item.productName || "Product Image"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-gray-800/80 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    <span className="text-sm">📷</span>
                    <span>1</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    {item.productName || "Unknown Product"}
                  </h3>
                {/*
                  <div className="bg-gray-700 text-white px-2 py-1 inline-block rounded mb-2">
                    <span>INR</span>
                    <span className="ml-2">{item.price}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <span>📍</span>
                    <span>{item.address || "No Address"}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>👤</span>
                    <span>
                      {item.first_name} {item.last_name}
                    </span>
                  </div>
                  */}
                  </div> 
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}