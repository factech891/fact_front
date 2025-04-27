// src/App.js (actualizado para visor y NotificationsProvider)
import React from 'react';
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
// Importamos el proveedor de notificaciones
import { NotificationsProvider } from './context/NotificationsContext';
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
    backgroundColor: '#121212', // Considerar usar theme.palette.background.default
    color: 'white' // Considerar usar theme.palette.text.primary
  }}>
    <h1>Acceso no autorizado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
  </div>
);

// Componente para la página no encontrada
const NotFound = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#121212', // Considerar usar theme.palette.background.default
    color: 'white' // Considerar usar theme.palette.text.primary
  }}>
    <h1>Página no encontrada</h1>
    <p>La página que estás buscando no existe.</p>
  </div>
);


function App() {
  return (
    // Proveedor de Tema de Material UI
    <ThemeProvider theme={theme}>
      {/* Normaliza estilos CSS */}
      <CssBaseline />
      {/* Proveedor de Autenticación */}
      <AuthProvider>
        {/* Proveedor de Notificaciones (nuevo) */}
        <NotificationsProvider>
          {/* Definición de Rutas */}
          <Routes>
            {/* Rutas públicas de autenticación */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            {/* Ruta para acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rutas protegidas que usan el DashboardLayout */}
            <Route
              path="/"
              element={
                // Proteger el layout principal
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Ruta índice (Dashboard) - accesible para admin, manager, visor */}
              <Route index element={
                <ProtectedRoute requiredRoles={['admin', 'manager', 'visor']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* Ruta explícita del Dashboard */}
              <Route path="dashboard" element={
                <ProtectedRoute requiredRoles={['admin', 'manager', 'visor']}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Rutas de Facturas */}
              <Route path="invoices" element={<Invoices />} /> {/* Asumo acceso general dentro del layout */}
              <Route path="invoices/new" element={
                <ProtectedRoute> {/* Asumo que crear requiere estar logueado */}
                  <InvoiceForm />
                </ProtectedRoute>
              } />
              <Route path="invoices/edit/:id" element={
                <ProtectedRoute> {/* Asumo que editar requiere estar logueado */}
                  <InvoiceForm />
                </ProtectedRoute>
              } />

              {/* Rutas de Cotizaciones/Documentos */}
              <Route path="documents" element={<Documents />} /> {/* Asumo acceso general */}
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
              <Route path="documents/view/:id" element={<DocumentPreview />} /> {/* Asumo vista pública o protegida por layout */}

              {/* Rutas de Clientes */}
              <Route path="clients" element={<Clients />} /> {/* Asumo acceso general */}
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
              <Route path="products" element={<Products />} /> {/* Asumo acceso general */}
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

              {/* Rutas de Gestión de Usuarios - solo admin y gerente */}
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

              {/* Ruta de Configuración General - solo admin y gerente */}
              <Route path="settings" element={
                <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Ruta de Perfil de Usuario - accesible para todos los logueados */}
              <Route path="settings/profile" element={<ProfilePage />} /> {/* Protegido por el layout padre */}

            </Route> {/* Fin de las rutas dentro de DashboardLayout */}

            {/* Ruta para páginas no encontradas (Catch-all) */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
