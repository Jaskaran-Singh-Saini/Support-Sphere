import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { MoodProvider } from './context/MoodContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MoodProvider>
        <App />
      </MoodProvider>
    </BrowserRouter>
  </React.StrictMode>
);