import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import UserApi from './Api/UserApi';
import { jwtDecode } from 'jwt-decode';

const LoginPage = ({ userStatus,onLogin, onLogout }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const handleLogin = () => {
    // Add your authentication logic here
    // For simplicity, I'm just checking if the username and password are 'admin'
    sessionStorage.clear();
    UserApi.post('api/user/authenticate',
        JSON.stringify({username,password}),
        {
          headers:{'Content-Type':'application/json'}
        })
    .then(res =>{
      const accessToken = res?.data?.token;
      if(res.status === 200){
        if(jwtDecode(accessToken).role === 'ADMIN'){
          sessionStorage.setItem('token',accessToken)
          sessionStorage.getItem('token')
          onLogin(username,password,token);
          navigate("/")
          setError('')
        }
        setError('Sorry you don\'t have access to this portal')
      }else{
        setError('Username or Password is incorrect')
        console.log("No authenticated")
      }
      // setToken(res.data.token);
      // setData(res.data)
    }).catch(ex =>{
        if(ex.response.status === 401){
            setError('Username or Password is incorrect')
        }
    })
    // if (username === 'admin' && password === 'admin') {
    //     onLogin(username,password);
    //     navigate("/")

    // } else {
    //   alert('Invalid username or password');
    // }
  };

  return (
    <div className='container'>
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>{error}</label>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
