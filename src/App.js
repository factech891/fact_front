// src/App.js
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './pages/dashboard/Dashboard';
import Invoices from './pages/invoices/Invoices';
import { InvoiceForm } from './pages/invoices/InvoiceForm';
import Clients from './pages/clients/Clients';
import { ClientForm } from './pages/clients/ClientForm';
import Products from './pages/products/Products';
import { ProductForm } from './pages/products/ProductForm';
import Settings from './pages/settings/Settings';

// Importamos los componentes del módulo de documentos
import Documents from './pages/documents/Documents';
import DocumentForm from './pages/documents/DocumentForm';
import DocumentPreview from './pages/documents/DocumentPreview';

// Importamos los componentes del módulo de usuarios
import UserManagement from './pages/users/UserManagement';
import UserForm from './pages/users/UserForm';

// Importamos componentes de autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import theme from './theme';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Rutas protegidas con DashboardLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Rutas de Facturas */}
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/new" element={<InvoiceForm />} />
            <Route path="invoices/edit/:id" element={<InvoiceForm />} />
            
            {/* Rutas de Cotizaciones */}
            <Route path="documents" element={<Documents />} />
            <Route path="documents/new" element={<DocumentForm />} />
            <Route path="documents/edit/:id" element={<DocumentForm />} />
            <Route path="documents/view/:id" element={<DocumentPreview />} />
            
            {/* Rutas de Clientes */}
            <Route path="clients" element={<Clients />} />
            <Route path="clients/new" element={<ClientForm />} />
            <Route path="clients/edit/:id" element={<ClientForm />} />
            
            {/* Rutas de Productos */}
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            
            {/* Rutas de Usuarios */}
            <Route path="users" element={<UserManagement />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
            
            {/* Configuración */}
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Página no encontrada */}
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;