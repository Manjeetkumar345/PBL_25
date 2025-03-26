import React, { useState } from 'react';

export default function Shhipping() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount,SetAmount] = useState('');

  
  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const redirectToGooglePay = () => {
    // Implement your Google Pay redirection logic here
    console.log('Redirecting to Google Pay...');
  };
  const purchaseDone = ()=>{
    alert('Order is Placed Payment is done');
  }
  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input type="email" id="email" placeholder="Email address" className="w-full p-2 border rounded" />
            </div>

            {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <input type="text" placeholder="First name" className="w-full p-2 border rounded mb-2" />
              <input type="text" placeholder="Last name" className="w-full p-2 border rounded mb-2" />
              <input type="text" placeholder="Address" className="w-full p-2 border rounded mb-2" />
              <input type="text" placeholder="City" className="w-full p-2 border rounded mb-2" />
              <input type="text" placeholder="Country" className="w-full p-2 border rounded" />
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <select className="w-full p-2 border rounded mb-2" id="paymentMethod" onChange={handlePaymentChange}>
                <option value="card">Credit Card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
              </select>
              {paymentMethod === 'upi' && (
                <div id="upiField">
                  <input type="text" id="upiId" placeholder="Enter UPI ID" className="w-full p-2 border rounded mb-2" />
                  <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700" onClick={redirectToGooglePay}>
                    Pay with Google Pay
                  </button>
                </div>
              )}
              {paymentMethod === 'card' && (
                <div id="cardFields">
                  <input type="text" placeholder="Card Number" className="w-full p-2 border rounded mb-2" />
                  <input type="text" placeholder="Name on Card" className="w-full p-2 border rounded mb-2" />
                  <input type="text" placeholder="Expiration Date (MM/YY)" className="w-full p-2 border rounded mb-2" />
                  <input type="text" placeholder="CVC" className="w-full p-2 border rounded" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between py-2 border-b">
              <span>Subtotal</span>
              <span id="subtotal">64.00 INR</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Shipping</span>
              <span id="shipping">5.00 INR</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Taxes</span>
              <span id="taxes">5.52 INR</span>
            </div>
            <div className="flex justify-between font-semibold text-lg py-2">
              <span>Total</span>
              <span id="total">75.52 INR</span>
            </div>
            <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" onClick={purchaseDone}>Confirm Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}