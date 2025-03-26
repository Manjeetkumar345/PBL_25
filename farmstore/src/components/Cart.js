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
                          src={item.img_path || "https://via.placeholder.com/150"} 
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
                              ₹{(item.pricePerKg || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              ₹{((item.pricePerKg || 0) * 1.1).toFixed(2)}
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
                      <span className="font-bold">₹{subtotal.toFixed(2)}</span>
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
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Seller Inventory View */}
        {role === 'seller' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {store.length === 0 ? (
              <div className="text-center p-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No products in your inventory</h3>
                <button
                  onClick={() => navigate('/add-product')}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add New Product
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {store.map((item, index) => (
                  <div key={index} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                    <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.img_path || "https://via.placeholder.com/150"} 
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">{item.productName}</h2>
                          <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <div>Category: {item.categoryName || 'Vegetables'}</div>
                            <div>Available Stock: {item.quantity} kg</div>
                            <div>Price: ₹{(item.pricePerKg || 0).toFixed(2)} per kg</div>
                            <div>Total Value: ₹{((item.pricePerKg || 0) * (item.quantity || 0)).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}