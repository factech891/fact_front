import React from 'react';
// src/App.js (actualizado para visor)
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
import ProfilePage from './pages/settings/ProfilePage';

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

// Componente para la página no autorizada
const Unauthorized = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#121212',
    color: 'white'
  }}>
    <h1>Acceso no autorizado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
  </div>
);

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
          
          {/* Ruta de acceso no autorizado */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Rutas protegidas con DashboardLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard - accesible para todos excepto facturadores */}
            <Route index element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'visor']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'visor']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Facturas */}
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/new" element={
              <ProtectedRoute>
                <InvoiceForm />
              </ProtectedRoute>
            } />
            <Route path="invoices/edit/:id" element={
              <ProtectedRoute>
                <InvoiceForm />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Cotizaciones */}
            <Route path="documents" element={<Documents />} />
            <Route path="documents/new" element={
              <ProtectedRoute>
                <DocumentForm />
              </ProtectedRoute>
            } />
            <Route path="documents/edit/:id" element={
              <ProtectedRoute>
                <DocumentForm />
              </ProtectedRoute>
            } />
            <Route path="documents/view/:id" element={<DocumentPreview />} />
            
            {/* Rutas de Clientes */}
            <Route path="clients" element={<Clients />} />
            <Route path="clients/new" element={
              <ProtectedRoute>
                <ClientForm />
              </ProtectedRoute>
            } />
            <Route path="clients/edit/:id" element={
              <ProtectedRoute>
                <ClientForm />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Productos */}
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            } />
            <Route path="products/edit/:id" element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Usuarios - solo para admin y gerente */}
            <Route path="users" element={
              <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="users/new" element={
              <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="users/edit/:id" element={
              <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                <UserForm />
              </ProtectedRoute>
            } />
            
            {/* Configuración general - solo para admin y gerente */}
            <Route path="settings" element={
              <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Perfil - accesible para todos los usuarios */}
            <Route path="settings/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Página no encontrada */}
          <Route path="*" element={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: '#121212',
              color: 'white'
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