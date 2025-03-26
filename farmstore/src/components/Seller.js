import React, { useState } from 'react';
import axios from 'axios';

export default function Seller() {

  const {id} = JSON.parse(sessionStorage.getItem('user') || "{}");

  const [product, setProduct] = useState({
    category: "",
    name: "",
    seedname:"",
    seller_id: id,
    quantity: 0,
    harvest: "",
    expiry: "",
    price: 0,
    address: "",
    description: "",
    photo: null
  });

  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = (name !== "price" && name !== "expiry" && name !== "quantity") ? 
      value.toLowerCase() : value;
    
    setProduct(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large (max 5MB)');
        return;
      }

      setProduct(prev => ({
        ...prev,
        photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all product data
      Object.keys(product).forEach(key => {
        if (product[key] !== null && product[key] !== undefined) {
          formData.append(key, product[key]);
        }
      });

      const response = await axios.post('http://localhost:8001/api/auth/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert("Product listed successfully!");
        // Reset form
        setProduct({
          category: "",
          name: "",
          seedname:"",
          seller_id: "",
          quantity: 0,
          harvest: "",
          expiry: "",
          price: 0,
          address: "",
          description: "",
          photo: null
        });
        setPreview("");
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        alert(error.response.data.msg || 'Error submitting product');
      } else {
        alert('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">List Your Product {id} id</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Organic Apples"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seed Name</label>
                <input
                  type="text"
                  name="seedname"
                  value={product.seedname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Organic Apples"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Fruits"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (per kg)*</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)*</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                <input
                  type="date"
                  name="harvest"
                  value={product.harvest}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  value={product.expiry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                <input
                  type="text"
                  name="address"
                  value={product.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Where is the product located?"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your product..."
                  rows="3"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image*</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Choose File
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      className="sr-only"
                      accept="image/*"
                      required
                    />
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {product.photo ? product.photo.name : "No file chosen"}
                  </span>
                </div>
                {preview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="h-40 w-40 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isSubmitting ? 'Submitting...' : 'List Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}