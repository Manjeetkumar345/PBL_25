import React, { useState } from 'react';

export default function Shhipping() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const total = sessionStorage.getItem('total') || 0;

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderRes = await fetch('http://localhost:8001/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      const orderData = await orderRes.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Put your key in frontend .env
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'FarmHub',
        description: 'Purchase Payment',
        handler: async function (response) {
          const verifyRes = await fetch('http://localhost:8001/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('Payment Successful! Order Placed.');
          } else {
            alert('Payment verification failed.');
          }
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment could not be processed.');
    }
  };

  const handlePurchase = () => {
    if (paymentMethod === 'cod') {
      alert('Order Placed. Pay on Delivery!');
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <input type="email" placeholder="Email address" className="w-full p-2 border rounded" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <input type="text" placeholder="First name" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="Last name" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="Address" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="City" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="Country" className="w-full p-2 border rounded" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <select
              className="w-full p-2 border rounded mb-2"
              value={paymentMethod}
              onChange={handlePaymentChange}
            >
              <option value="card">Credit Card / UPI</option>
              <option value="cod">Cash on Delivery</option>
            </select>
            {paymentMethod === 'card' && <p className="text-gray-700 mt-2">You will be redirected to Razorpay.</p>}
            {paymentMethod === 'cod' && <p className="text-gray-700 mt-2">Pay with cash upon delivery.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between py-2 border-b">
            <span>Subtotal</span>
            <span>{total} INR</span>
          </div>
          <button
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            onClick={handlePurchase}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}