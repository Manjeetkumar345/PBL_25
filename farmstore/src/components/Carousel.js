import React, { useState } from 'react';
import img1 from "../Carousel/1mg.jpg";
import img2 from "../Carousel/3mg.jpg";
import img3 from "../Carousel/2mg.jpg";

const images = [img1, img2, img3];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel relative w-full" style={{ height: '500px' }}> {/* Increased height */}
      {/* Navbar space consideration - add your actual navbar above this component */}
      
      <div
        className="carousel-inner flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div
            className="carousel-item w-full h-full flex-shrink-0 bg-cover bg-center"
            key={index}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
      </div>

      <div className="carousel-indicators absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      <div className="carousel-controls absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
        <button 
          onClick={prevSlide}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &#10094;
        </button>
        <button 
          onClick={nextSlide}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}