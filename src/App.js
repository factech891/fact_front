// src/App.js
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './pages/dashboard/Dashboard';
import Invoices from './pages/invoices/Invoices';
import Clients from './pages/clients/Clients';
import Products from './pages/products/Products';
import Settings from './pages/settings/Settings';
import theme from './theme';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/products" element={<Products />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h1>Página no encontrada</h1>
              <p>La página que estás buscando no existe.</p>
            </div>
          } />
        </Routes>
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;