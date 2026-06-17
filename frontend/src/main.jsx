import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';
import { ItemProvider } from './context/ItemContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ItemProvider>
        <App />
      </ItemProvider>
    </BrowserRouter>
  </StrictMode>
);
