import React, { useState, useEffect } from "react";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [shipping, setShipping] = useState(5.0); // Example shipping cost
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Simulate fetching subtotal from localStorage
    const storedSubtotal = localStorage.getItem("cartSubtotal") || "64.00";
    const subtotalValue = parseFloat(storedSubtotal);
    setCartSubtotal(subtotalValue);

    // Calculate tax and total
    const calculatedTax = subtotalValue * 0.1; // Example tax calculation
    setTax(calculatedTax);
    setTotal(subtotalValue + shipping + calculatedTax);
  }, [shipping]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <input
                type="text"
                placeholder="First name"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <select
                className="w-full p-2 border rounded mb-2"
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <option value="card">Credit Card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
              </select>
              {paymentMethod === "upi" && (
                <div>
                  <input
                    type="text"
                    id="upiId"
                    placeholder="Enter UPI ID"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
                    Pay with Google Pay
                  </button>
                </div>
              )}
              {paymentMethod === "card" && (
                <div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YY)"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between py-2 border-b">
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Taxes</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg py-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
