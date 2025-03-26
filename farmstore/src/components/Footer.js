import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <footer className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="font-bold text-lg mb-4">GET IN TOUCH WITH US</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Address: Mirach Innovations FZ-LLC, 1st Floor, In5 Media
                  Centre, Dubai Production City Dubai, UAE.
                </p>
                <p>Phone: +91 7483721529</p>
                <p>
                  Delivery Timings:
                  <br />
                  Monday-Saturday:
                  <br />
                  9AM to 6PM
                  <br />
                  Sunday: Closed
                </p>
                <p>info@fasalmandi.in</p>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">USEFUL LINKS</h3>
              <div className="space-y-2">
                <Link to="/Seller" className="text-gray-600 hover:text-gray-900">
                  See all Sellers
                </Link>
                <Link to="/Term" className="text-gray-600 hover:text-gray-900">
                  Terms & Services
                </Link>
                <Link
                  to="/Shipping"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Shipping & Delivery Policy
                </Link>
                <Link to="/Privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy policy
                </Link>
                <Link to="/News" className="text-gray-600 hover:text-gray-900">
                  News
                </Link>
                <Link to="/Contact" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
                <Link to="/About" className="text-gray-600 hover:text-gray-900">
                  About us
                </Link>
                <Link to="/FAQ" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Twitter Update */}
            <div>
              <h3 className="font-bold text-lg mb-4">TWITTER UPDATE</h3>
              <div className="text-gray-600">
                "Farmers are increasingly becoming interested in hydroponics,
                vertical farming and drone technology"
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-4">OUR NEWSLETTER</h3>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <button className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-600 text-sm text-center">
              ©2024 Fasal Mandi - All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
