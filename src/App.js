// src/App.js - con imports corregidos
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './pages/dashboard/Dashboard';
import Invoices from './pages/invoices/Invoices';
import { InvoiceForm } from './pages/invoices/InvoiceForm'; // Cambiado a import nombrado
import Clients from './pages/clients/Clients';
import { ClientForm } from './pages/clients/ClientForm'; // Cambiado a import nombrado
import Products from './pages/products/Products';
import { ProductForm } from './pages/products/ProductForm'; // Cambiado a import nombrado
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
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas de Facturas */}
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
          <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
          
          {/* Rutas de Clientes */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/edit/:id" element={<ClientForm />} />
          
          {/* Rutas de Productos */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          
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