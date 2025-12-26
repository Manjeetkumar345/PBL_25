import axios from "axios";
import React, { useState, useEffect } from "react";
import { addItem } from "../redux/slices/cartslices";
import  { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";

export default function Negotiate() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get item data passed from Itemstype or fallback from localStorage
  const [item, setItem] = useState(null);
  const [offer, setOffer] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const selectedItem = location.state?.item
    if (selectedItem) {
      setItem(selectedItem);
      setOffer(selectedItem.price); // start at base price
    }
  }, [location.state]);

  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        No item selected.
      </div>
    );
  }

  // Price range: 50% below to 20% above the base price
  const minPrice = Math.round(item.price * 0.5);
  const maxPrice = Math.round(item.price * 1.2);

  const handleConfirm = async () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const data = {
      buyerId: user.id,
      sellerId: item.sellerId,
      productId: item._id,
      negotiatedprice: offer,
    };

    const response = await axios.post(
      "http://localhost:8001/api/negotiate/sentReq",
      data
    );

    console.log("Negotiation Sent:", response.data);

    dispatch(
          addItem({
            productid: item._id,
            sellerId: item.sellerId,
            seed_breed: item.seed_breed,
            quantity: item.quantity,
            pricePerKg: offer,
            category: item.categoryName,
          })
        );

    const notification = {
      buyerId:user.id,
      sellerId:item.sellerId,
      negotiationId:response._id,
      sentBy:"buyer",
      status:"sent",
    }

    if (response.status === 200) {
      
      alert(`Your offer of ₹${offer} per kg has been recorded!`);
    }
  } catch (err) {
    console.error("Error sending negotiation:", err.response?.data || err);
    alert("Something went wrong while sending your offer.");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Negotiate Price
        </h2>

        {/* Product Card */}
        <div className="flex flex-col items-center border rounded-xl p-4 mb-6">
          <img
            src={item.img}
            alt={item.seed_breed}
            className="w-48 h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-green-800">
            {item.seed_breed}
          </h3>
          <p className="text-gray-600">{item.address}</p>
          <p className="text-gray-500">
            Quantity: {item.quantity} kg | Base Price: ₹{item.price} per kg
          </p>
        </div>

        {/* Price Range Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Your Offer
          </label>
          <div className="flex items-center justify-between mb-2">
            <span>₹{minPrice}</span>
            <span>₹{maxPrice}</span>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="w-full accent-green-600"
          />
          <p className="text-center text-lg font-semibold text-green-700 mt-2">
            Your Offer: ₹{offer} per kg
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Confirm Offer
          </button>
        </div>
      </div>
    </div>
  );
}