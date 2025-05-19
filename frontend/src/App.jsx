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
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';

function App() {
  const { isLoading,authUser }=useAuthUser()


    const isAuthnticated= Boolean(authUser)
    const isOnboarded = authUser?.isOnboarded



  if(isLoading){
    return <PageLoader/>
  }

  
  return (
    <div className="h-screen " data-theme="dracula">
      
          <Routes>
            <Route path="/" element={isAuthnticated  && isOnboarded?<HomePage />: (
              <Navigate to={!isAuthnticated ? "/login" : "/onboarding"} />
            )} />
            <Route path="/signup" element={!isAuthnticated ?<SignUpPage />: <Navigate to={
              isOnboarded ? "/" : "/onboarding"
            } />} />


            <Route path="/login" element={!isAuthnticated ? <LoginPage />: <Navigate to={
              isOnboarded ? "/" : "/onboarding"}/>} />
            <Route path="/chat" element={isAuthnticated ?<ChatPage />: <Navigate to="/login"/>} />
            <Route path="/call" element={isAuthnticated ?<CallPage />: <Navigate to="/login"/>} />
            <Route path="/onboarding" element={isAuthnticated ?<OnBoardingPage />: <Navigate to="/login"/>} /> 
            <Route path="/notification" element={isAuthnticated ? <NotificationPage /> : <Navigate to="/login"/>} />

          </Routes>
          <Toaster/>
    </div>
  );
}

export default App;
