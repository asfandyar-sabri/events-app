// import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


// Load environment variables from .env
// dotenv.config();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

