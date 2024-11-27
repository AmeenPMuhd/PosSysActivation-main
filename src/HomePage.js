import { useState } from 'react';
import './App.css';
import Header from './Component/Header';
import Details from './Component/Details';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ userStatus, onLogout }) => {
    const [selectedChatbot, setSelectedChatbot] = useState("Shop Details");
    const navigate = useNavigate();

    const handleChatbotClick = (chatbotName) => {
      setSelectedChatbot(chatbotName);
    };

    const handleLogout = () => {
      sessionStorage.removeItem('token');
      navigate("/login")
    }

  
    return (
      <div className="App">
        <Header onLogout={handleLogout}></Header>
        <div className="main-content">
          <div className="sidebar">
            <ul>
              <li style={{height:25,borderRadius:7,backgroundColor: selectedChatbot==='Shop Details'?'#BDBDBD':''}} onClick={() => handleChatbotClick('Shop Details')}>Shop Details</li>
              <li style={{height:25,borderRadius:7,backgroundColor: selectedChatbot==='User Details'?'#BDBDBD':''}} onClick={() => handleChatbotClick('User Details')}>User Details</li>
              <li style={{height:25,borderRadius:7,backgroundColor: selectedChatbot==='Shop Systems'?'#BDBDBD':''}} onClick={() => handleChatbotClick('Shop Systems')}>Shop Systems</li>
              <li style={{height:25,borderRadius:7,backgroundColor: selectedChatbot==='File'?'#BDBDBD':''}} onClick={() => handleChatbotClick('File')}>File</li>
              {/* Add more chatbots as needed */}
            </ul>
          </div>
          <div className="content">
            <Details selectedChatbot={selectedChatbot} />
          </div>
        </div>
      </div>
    );
};

export default HomePage;
