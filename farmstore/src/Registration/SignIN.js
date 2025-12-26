import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Sign.css';

export default function SignIN() {
  const [register, setRegister] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
    role: '',
    password: '',
  });

  const navigate = useNavigate();

  const saveRegister = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Frontend",register);
    try {
      const response = await axios.post('http://localhost:8001/api/auth/register', register);
      if (response.status === 200) {
        alert(response.data.msg);

        sessionStorage.setItem('user', JSON.stringify({ 
          name: register.name,
          role:response.data.role,
          id:response.data._id
        }));
        
        if(register.role === 'buyer')        navigate('/login');
        if(register.role === 'seller')        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg,"In catch");
      } else {
        console.error('Error during registration:', error);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="body">
      <div className="form-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={register.name}
              onChange={saveRegister}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={register.email}
              onChange={saveRegister}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Phone Number:</label>
            <input
              type="tel"
              id="number"
              name="number"
              placeholder="Enter your phone number"
              value={register.number}
              onChange={saveRegister}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={register.address}
              onChange={saveRegister}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={register.password}
              onChange={saveRegister}
              required
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={register.role === 'buyer'}
                  onChange={saveRegister}
                  required
                />{' '}
                Buyer
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={register.role === 'seller'}
                  onChange={saveRegister}
                  required
                />{' '}
                Seller
              </label>
            </div>
          </div>
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        <div className="link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
