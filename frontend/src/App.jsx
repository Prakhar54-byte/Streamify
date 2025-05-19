import React from 'react';
import { Routes ,Route, Navigate} from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';

import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';
import PageLoader from './components/PageLoader.jsx';

function App() {


  const {data:authData,isLoading} = useQuery({
    queryKey:["authUser"],

    queryFn:async()=>{
      const res = await axiosInstance.get("/auth/me",)
      return res.data
    }
  })
  const authUser = authData?.user

  if(isLoading){
    return <PageLoader/>
  }

  
  return (
    <div className="h-screen " data-theme="dracula">
      
          <Routes>
            <Route path="/" element={authUser ?<HomePage />: <Navigate to="/login"/>} />
            <Route path="/signup" element={!authUser ?<SignUpPage />: <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to="/"/>} />
            <Route path="/chat" element={authUser ?<ChatPage />: <Navigate to="/login"/>} />
            <Route path="/call" element={authUser ?<CallPage />: <Navigate to="/login"/>} />
            <Route path="/onboarding" element={authUser ?<OnBoardingPage />: <Navigate to="/login"/>} /> 
            <Route path="/notification" element={authUser ? <NotificationPage /> : <Navigate to="/login"/>} />

          </Routes>
          <Toaster/>
    </div>
  );
}

export default App;
