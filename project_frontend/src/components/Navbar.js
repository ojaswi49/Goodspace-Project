import React from 'react';
import '../Styles/navbar.css';
import images from '../assets/exo';
import { useNavigate, Navigate } from 'react-router-dom';

const Navbar = ({isProfile}) => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    localStorage.removeItem('token');
    navigate('/');
  }
  return (
    <div className='navbar'>
      <img src={images.logo} alt="" className='logo'/>
      {isProfile && <button className='Logout_button' onClick={handleSubmit}>Logout</button>}
    </div>
  )
}

export default Navbar
