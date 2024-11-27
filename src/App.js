
import './App.css';
import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes
} from "react-router-dom";
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Layout from './Component/Layout';
import PrivateRoute from './PrivateRoute';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const path = require('path');
  // const navigate = useNavigate();
  const handleLogin = (userName, userPassword, userToken) => {
    setUsername(userName);
    setToken(userToken)
    
    setLoggedIn(true);
    // Redirect to home page upon successful login
  };

  useEffect(()=>{
    localStorage.setItem("accessToken",token)
  },[token])

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
  };

  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
          <Route path='/' element={
            <PrivateRoute>
              <HomePage userStatus={loggedIn} onLogout={handleLogout} token={token} usename={username}></HomePage>
            </PrivateRoute>
          }/>
        <Route path='/login' element={<LoginPage userStatus={loggedIn} onLogin={handleLogin} onLogout={handleLogout}/>} />
      </Route>
    </Routes>
    )
}
export default App;
