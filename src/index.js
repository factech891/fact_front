import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Desactivar console.logs en producción
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.info = () => {};
  // Mantener warnings y errores para debugging
  // console.warn = () => {};
  // console.error = () => {};
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);