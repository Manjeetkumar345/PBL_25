import React, { useState,useEffect } from 'react';
import "../CSS/Itemstype.css"
import { addItem } from '../redux/slices/cartslices';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Itemstype() {
  const store = [
    {
      address: "456 Maple Street, Denver, Colorado, 80202, USA",
      seed_breed: "Hybrid Corn",
      quantity: 30,
      distance_km: 30,
      price: 50,
    },
    {
      address: "789 Oak Avenue, Austin, Texas, 73301, USA",
      seed_breed: "Sunflower",
      quantity: 20,
      distance_km: 40,
      price: 45,
    },
    {
      address: "321 Pine Lane, Seattle, Washington, 98101, USA",
      seed_breed: "Soybean",
      quantity: 25,
      distance_km: 32,
      price: 48,
    },
    {
      address: "654 Birch Road, Miami, Florida, 33101, USA",
      seed_breed: "Rice",
      quantity: 15,
      distance_km: 38,
      price: 40,
    },
    {
      address: "987 Cedar Street, Boston, Massachusetts, 02108, USA",
      seed_breed: "Barley",
      quantity: 40,
      distance_km: 36,
      price: 55,
    },
    {
      address: "159 Elm Boulevard, Phoenix, Arizona, 85001, USA",
      seed_breed: "Peanut",
      quantity: 18,
      distance_km: 33,
      price: 42,
    },
    {
      address: "753 Willow Court, Nashville, Tennessee, 37201, USA",
      seed_breed: "Cotton",
      quantity: 22,
      distance_km: 37,
      price: 47,
    },
    {
      address: "852 Spruce Drive, Portland, Oregon, 97201, USA",
      seed_breed: "Millet",
      quantity: 28,
      distance_km: 39,
      price: 49,
    },
    {
      address: "369 Redwood Terrace, Chicago, Illinois, 60601, USA",
      seed_breed: "Quinoa",
      quantity: 35,
      distance_km: 34,
      price: 52,
    },
    {
      address: "741 Poplar Way, San Diego, California, 92101, USA",
      seed_breed: "Chickpea",
      quantity: 26,
      distance_km: 31,
      price: 46,
    },
  ];
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [real,setReal] = useState([])

  const [item, setItem] = useState({
    address: store[0].address,
    seed_breed: store[0].seed_breed,
    quantity: store[0].quantity,
    distance_km: store[0].distance_km,
  });

  const handleItems = (selectedItem) => {
    setItem({
      address: selectedItem.address,
      seed_breed: selectedItem.seed_breed,
      quantity: selectedItem.quantity,
      distance_km: selectedItem.distance_km,
      price:selectedItem.price,
      categoryName: selectedItem.category,
    });
  };

  useEffect(()=>{
    const handleGetProducts = async () => {
      try {
          const selectedItem = JSON.parse(localStorage.getItem("selectedItem"));
          console.log("ItemType.js",selectedItem);
          
          if (!selectedItem) {
              alert("No item Selected");
          }
          
          const params = {
              categoryName: selectedItem.category,
              productName: selectedItem.productName
          };
          const response = await axios.get("http://localhost:8001/api/auth/getproduct", { params });
          console.log("Response",response.data);
          setReal(response.data);
      } catch(error) {
          console.error("Error fetching product:", error);
          setReal([]);
      }
    };
    handleGetProducts();
  },[])
  return (
    <div className="Container">
        <div className="list-1">
          {/* Real data first */}
          {real.map((e) => (
            <div className="document" key={`real-${e._id}`}
              onClick={() => handleItems({
                address: e.address,
                seed_breed: e.seedName,
                quantity: e.quantity,
                distance_km: 30, // Default distance
                price: e.pricePerKg
              })}>
              {e.address} <br />
              Seed: {e.seedName} <br />
              Quantity: {e.quantity} kg<br/>
              Price: {e.pricePerKg} per kg
            </div>
          ))}

          {/* Dummy data if no real data exists */}
          {real.length === 0 && store.map((e) => (
            <div className="document" key={`dummy-${e.address}`}
              onClick={() => handleItems(e)}>
              {e.address} <br />
              Seed: {e.seed_breed} <br />
              Quantity: {e.quantity} kg<br/>
              Price: {e.price} per kg
            </div>
          ))}
        </div>
        <div className="list-2">
            <div className="main">
              <img src="/Img/download.jpeg" alt="" />
              <p>Address: {item.address}</p>
              <p> 
                <span>Seed: {item.seed_breed}</span>
                <span>Distance: {item.distance_km} km</span>
              </p>
              <p>
              <span>Quantity: {item.quantity} kg</span>
              <span onClick={()=> navigate('/negotiate')}>Negotiate</span>
              <span>Price:{item.price} per kg</span>
              </p>
              <button onClick={()=> dispatch(addItem({seed_breed: item.seed_breed,quantity:item.quantity,pricePerKg:item.price,
                category:item.categoryName
              }))}>Add To WishList </button>
            </div>

        </div>
    </div>
  );
}