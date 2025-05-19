import React from 'react'; // ✅ Add this line
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StrictMode } from 'react';

import { BrowserRouter } from 'react-router';

const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
  </BrowserRouter>
    </StrictMode>
);
