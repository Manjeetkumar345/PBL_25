import React  from 'react'
import { Link } from 'react-router-dom';

export default function Navbar() {
    const {role} = JSON.parse(sessionStorage.getItem('user')||'{}');
  return (
    <header>
    {/* <!-- Top bar with Language and Login --> */}
    <div className="bg-green-700 text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            {/* <!-- Language Selector --> */}
            <div className="flex items-center gap-2 cursor-pointer">
                <span>Language</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>

            {/* <!-- Search Bar with Dropdown --> */}
            <div className="flex-1 max-w-xl mx-8">
                <div className="flex">
                    <select className="w-[150px] rounded-r-none bg-white text-black border border-gray-300 p-2">
                        <option value="all">All Categories</option>
                        <option value="fruits">Fruits</option>
                        <option value="vegetables">Vegetables</option>
                    </select>
                    <div className="flex-1 relative">
                        <input type="search" placeholder="Search Product" className="w-full px-4 py-2 border border-gray-300"/>
                        <button className="absolute right-0 top-0 h-full px-4 bg-green-600 text-white">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* <!-- Login and Registration --> */}
            <div className="flex items-center gap-2">
                <Link to="/login" className="hover:underline">Login
                </Link>
                {/* <span>/</span> */}
                {/* <Link to="/signin" className="hover:underline">Registration</Link> */}
            </div>
        </div>
    </div>

    {/* <!-- Navigation Bar --> */}
    <nav className="border-b">
        <div className="container mx-auto px-6">
            <div className="flex items-center justify-center py-6">
    
                {/* <!-- Navigation Links --> */}
                <div className="flex items-center justify-center gap-10">
                <Link to="/" className="hover:text-green-700">Home</Link>
                  {/* Role-specific links */}
                  {role === 'seller' ? (
                    <Link to="/seller" className="hover:text-green-700">Seller Dashboard</Link>
                  ) : (
                    <>
                      <Link to="/shipping" className="hover:text-green-700">Shipping</Link>
                    </>
                  )}

                  {/* Common link for all authenticated users */}
                  <Link to="/services" className="hover:text-green-700">Services</Link>
                  <Link to="/deals" className="hover:text-green-700">Deals</Link>
                  <Link to="/cart" className="hover:text-green-700">Cart</Link>
                </div>
            </div>
        </div>
    </nav>
</header>
  )
}
