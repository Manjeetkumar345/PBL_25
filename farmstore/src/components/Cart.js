import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getItemSelector, removeItem } from '../redux/slices/cartslices';
import axios from 'axios';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(getItemSelector);
  const [quantities, setQuantities] = useState({});
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(true);

  const { name, role, id } = JSON.parse(sessionStorage.getItem('user')) || '{}';

  // Quantity handlers
  const Increase = (index) => {
    setQuantities(prev => ({
      ...prev,
      [index]: Math.min((prev[index] || 1) + 1, items[index]?.quantity || 1)
    }));
  };

  const Decrease = (index) => {
    setQuantities(prev => ({
      ...prev,
      [index]: Math.max((prev[index] || 1) - 1, 1)
    }));
  };
// My Domain


 /// Here 

  /////
  // Fetch seller's inventory
  useEffect(() => {
    const fetchcart = async () => {
      try {
        if (role === 'seller' && id) {
          const response = await axios.get(`http://localhost:8001/api/auth/showproducts`, {
            params: { seller_id: id }
          });
          setStore(response.data || []);
        }
      } catch(error) {
        console.error("Fetching error:", error);
        setStore([]);
      } finally {
        setLoading(false);
      }
    };
    fetchcart();
  }, [id, role]);
  
  // Calculate subtotal with proper schema field
  const subtotal = items.reduce((sum, item, index) => 
    sum + ((item.pricePerKg || 0) * (quantities[index] || 1)), 0);
  
  sessionStorage.setItem('total',subtotal.toFixed(2));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className='bg-green-50 min-h-screen p-6'>
      {/* {role} */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {role === 'buyer' ? `${name}'s Shopping Cart` : `${name}'s Product Inventory`}
        </h1>

        {/* Buyer Cart View */}
        {role === 'buyer' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {items.length === 0 ? (
              <div className="text-center p-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
                <button
                  onClick={() => navigate('/itemType')}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {items.map((item, index) => (
                    <div key={index} className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={item.img} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-800">{item.productName}</h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                In Stock
                              </span>
                              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                Direct from Farm
                              </span>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-600">
                              <div>Category: {item.categoryName || 'Vegetables'}</div>
                              <div>Product : {item.seed_breed || 'Vegetables'}</div>

                              <div>Available: {item.quantity} kg</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                              ₹{Number(item.pricePerKg || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              ₹{(Number(item.pricePerKg || 0) * 1.1).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button 
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                              onClick={() => Decrease(index)}
                            >
                              -
                            </button>
                            <div className="px-4 py-2 w-12 text-center">
                              {quantities[index] || 1}
                            </div>
                            <button 
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                              onClick={() => Increase(index)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            onClick={() => dispatch(removeItem(item))}
                          >
                            Remove
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium">
                      Subtotal ({items.length} items): 
                      <span className="font-bold">₹{Number(subtotal).toFixed(2)}</span>
                    </div>
                    <div className="space-x-3">
                      <button
                        className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors"
                        onClick={() => navigate('/itemType')}
                      >
                        Continue Shopping
                      </button>
                      <button
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => navigate('/shipping')}
                      >
                        Proceed to Checkout
                      </button>
                      {/* <button
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => navigate("/negotiate", { state: { item: item } })} // 2nd item ka do somthing
                      >
                        Negotiate
                      </button> */}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Seller Inventory View */}
        {role === 'seller' && (
          <SellerCart store = {store}/>
        )}
      </div>
    </div>
  );
}

const SellerCart = ({ store }) => {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user?.id) return;

        const response = await axios.get(
          "http://localhost:8001/api/negotiate/recReq",
          { params: { sellerId: user.id } }
        );

        setOffers(response.data || []);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {store.length === 0 ? (
        <div className="text-center p-12">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No products in your inventory
          </h3>
          <button
            onClick={() => navigate("/itemType")}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Product
          </button>
        </div>
      ) : (
        <div className="divide-y">
          {store.map((item) => (
            <div
              key={item._id}
              className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors"
            >
              <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.img_path || "https://via.placeholder.com/150"}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  
                  {/* PRODUCT INFO */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.productName}
                    </h2>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div>Category: {item.categoryName}</div>
                      <div>Product: {item.seedName}</div>
                      <div>Available Stock: {item.quantity} kg</div>
                      <div>Price: ₹{item.pricePerKg} per kg</div>
                      <div>Total Value: ₹{item.pricePerKg * item.quantity}</div>
                    </div>
                  </div>

                  {/* OFFERS BOX */}
                  <div className="w-[450px] bg-gray-50 border rounded-lg p-3 max-h-64 overflow-y-auto hide-scrollbar">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      Offers
                    </h3>

                    {offers
                      .filter((o) => o.productId?._id === item._id)
                      .map((offer) => (
                        <OfferItem key={offer._id} offer={offer} />
                      ))}

                    {offers.filter((o) => o.productId?._id === item._id).length === 0 && (
                      <div className="text-gray-500 text-sm">No offers yet</div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const OfferItem = ({ offer }) => {
  const [newPrice, setNewPrice] = useState(offer.offeredPrice);

  // ✅ SAFE USER PARSING
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const sellerId = user?.id || null;

  const sendResponse = async (type) => {
    const payload = {
      sellerId,
      buyerId: offer.buyerId?._id || null,
      productId: offer.productId?._id || null,
      status: type,
      reoffer: type === "pending" ? newPrice : null,
    };

    console.log("Sending:", payload);

    await axios.post("http://localhost:8001/api/negotiate/sentRes", payload);
    alert("Response sent!");
  };

  return (
    <div className="w-full bg-white border rounded-lg p-3 shadow-sm mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">
          {offer.buyerId?.name}
        </span>
        <span className="text-green-600 font-semibold">
          ₹{offer.offeredPrice} per kg
        </span>
      </div>

      {/* RANGE FOR REOFFER */}
      <div className="my-3">
        <input
          type="range"
          min={offer.offeredPrice}
          max={offer.offeredPrice + 50}
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-full accent-green-600"
        />
        <p className="text-sm text-green-700 text-center mt-1">
          New Offer: ₹{newPrice} per kg
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          className="px-3 py-1 bg-yellow-300 text-green-900 rounded-md hover:bg-yellow-400"
          onClick={() => sendResponse("pending")}
        >
          Reoffer
        </button>

        <button
          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => sendResponse("accepted")}
        >
          Match
        </button>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => sendResponse("rejected")}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
