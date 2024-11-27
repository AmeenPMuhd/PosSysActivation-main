// Header.js

import React from 'react';
import './Header.css';
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';

const Header = ({onLogout}) => {
  const navigate = useNavigate();

  const handleLogout = () =>{
    sessionStorage.removeItem('token');
      navigate("/login")
  }
  return (
    <header>
      <div style={{height:20}}>
        <div style={{fontWeight:'bold'}}>
            PosSys Activator
        </div>
      </div>
      <div className="right-section">
        <div className="link">Help</div>
        <div className="link">Account</div>
        <div className="link" onClick={handleLogout}>Logout</div>
      </div>
      
    </header>
  );
};

export default Header;
