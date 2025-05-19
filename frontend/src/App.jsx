import React from 'react';
import { Routes ,Route} from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="h-screen " data-theme="dracula">
      
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/call" element={<CallPage />} />
            <Route path="/onboarding" element={<OnBoardingPage />} /> 
            <Route path="/notification" element={<NotificationPage />} />

          </Routes>
          <Toaster/>
    </div>
  );
}

export default App;
