import React from 'react'; // ✅ Add this line
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StrictMode } from 'react';

import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
      <App />
  </BrowserRouter>
    </StrictMode>
);
