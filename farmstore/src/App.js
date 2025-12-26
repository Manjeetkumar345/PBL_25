// import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
// npm i react-router-dom
import './App.css';
import Navbar from './components/Navbar';
// import Itemstype from './components/Itemstype';
import ProductCat from './components/ProductCat';
import Footer from './components/Footer';
import Login from './Registration/Login'
import SignIN from './Registration/SignIN';
import Cart from './components/Cart';
// import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import Itemstype from './components/Itemstype';
import Shhipping from './components/Shhipping';
import Seller from './components/Seller';
import Negotiate from './components/Negotiate';



function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element= {<HomePage/>}/>
          <Route path="/productcategory" element= {<ProductCat/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/signin' element={<SignIN/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/itemType' element={<Itemstype/>}/>
          <Route path='/shipping' element={<Shhipping/>}/>
          <Route path='/seller' element={<Seller/>}/>
          <Route path='/negotiate' element={<Negotiate/>}/>
        </Routes>
     <Footer/> 
    </Router>
    {/* //  <Itemstype/> */}
    </>   
    
  );
}

export default App;
