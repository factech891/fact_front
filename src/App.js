// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import PlatformAdminLayout from './layouts/PlatformAdminLayout'; // Importar el nuevo layout

// Pages - Autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmailNotice from './pages/auth/VerifyEmailNotice'; // Añadido desde la modificación
import VerifyEmailConfirm from './pages/auth/VerifyEmailConfirm'; // Añadido desde la modificación

// Pages - Aplicación Principal
import Dashboard from './pages/dashboard/Dashboard';
import Invoices from './pages/invoices/Invoices';
import { InvoiceForm } from './pages/invoices/InvoiceForm';
import Clients from './pages/clients/Clients';
import { ClientForm } from './pages/clients/ClientForm';
import Products from './pages/products/Products';
import { ProductForm } from './pages/products/ProductForm';
import Settings from './pages/settings/Settings';
import ProfilePage from './pages/settings/ProfilePage';
import Documents from './pages/documents/Documents';
import DocumentForm from './pages/documents/DocumentForm';
import DocumentPreview from './pages/documents/DocumentPreview';
import UserManagement from './pages/users/UserManagement';
import UserForm from './pages/users/UserForm';

// Pages - Platform Admin
import PlatformAdminDashboard from './pages/platformAdmin/Dashboard'; // Importar el dashboard de admin
import PlatformAdminCompanies from './pages/platformAdmin/Companies'; // Importar la nueva página de Compañías

// Contextos y Componentes Utilitarios
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme';
import './styles/global.css';

// Componente para la página no autorizada (actualizado con theme)
const Unauthorized = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: theme.palette.background.default, // Usa el tema
    color: theme.palette.text.primary // Usa el tema
  }}>
    <h1>Acceso no autorizado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
  </div>
);

// Componente para la página no encontrada (actualizado con theme)
const NotFound = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: theme.palette.background.default, // Usa el tema
    color: theme.palette.text.primary // Usa el tema
   }}>
    <h1>Página no encontrada</h1>
    <p>La página que estás buscando no existe.</p>
  </div>
);


function App() {
  // --- IMPORTANTE: Define aquí el rol exacto para el administrador de plataforma ---
  const PLATFORM_ADMIN_ROLE = 'platform_admin'; // O 'super_admin', etc. ¡Asegúrate que coincida con tu AuthContext!

  return (
    // Proveedor de Tema de Material UI
    <ThemeProvider theme={theme}>
      {/* Normaliza estilos CSS */}
      <CssBaseline />
      {/* Proveedor de Autenticación */}
      <AuthProvider>
        {/* Proveedor de Notificaciones */}
        <NotificationsProvider>
          {/* Definición de Rutas */}
          <Routes>
            {/* Rutas públicas de autenticación */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-email-notice" element={<VerifyEmailNotice />} />
            <Route path="/auth/verify-email/:token" element={<VerifyEmailConfirm />} />

            {/* Ruta para acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* --- Rutas Protegidas para Usuarios Normales (Layout Principal) --- */}
            <Route
              path="/"
              element={
                // Proteger el layout principal
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Principal */}
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

              {/* Facturas */}
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/new" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
              <Route path="invoices/edit/:id" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />

              {/* Documentos/Cotizaciones */}
              <Route path="documents" element={<Documents />} />
              <Route path="documents/new" element={<ProtectedRoute><DocumentForm /></ProtectedRoute>} />
              <Route path="documents/edit/:id" element={<ProtectedRoute><DocumentForm /></ProtectedRoute>} />
              <Route path="documents/view/:id" element={<DocumentPreview />} />

              {/* Clientes */}
              <Route path="clients" element={<Clients />} />
              <Route path="clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
              <Route path="clients/edit/:id" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />

              {/* Productos */}
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
              <Route path="products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />

              {/* Gestión de Usuarios (Empresa) */}
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

              {/* Configuración (Empresa) */}
              <Route path="settings" element={
                <ProtectedRoute requiredRoles={['admin', 'gerente']}>
                  <Settings />
                </ProtectedRoute>
              } />
              {/* Perfil (Todos los logueados) */}
              <Route path="settings/profile" element={<ProfilePage />} /> {/* Protegido por el layout padre */}

            </Route> {/* Fin de rutas bajo DashboardLayout */}


            {/* --- Rutas Protegidas para Administrador de Plataforma --- */}
            <Route
              path="/platform-admin" // Base path para el panel de admin
              element={
                <ProtectedRoute requiredRoles={[PLATFORM_ADMIN_ROLE]}> {/* Protege TODO el panel de admin */}
                  <PlatformAdminLayout /> {/* Usa el layout específico de admin */}
                </ProtectedRoute>
              }
            >
              {/* Dashboard del Admin */}
              <Route index element={<PlatformAdminDashboard />} /> {/* Ruta índice /platform-admin */}
              <Route path="dashboard" element={<PlatformAdminDashboard />} /> {/* Ruta explícita */}

              {/* --- Inicio Modificación: Añadir ruta de Compañías --- */}
              <Route path="companies" element={<PlatformAdminCompanies />} />
              {/* --- Fin Modificación: Añadir ruta de Compañías --- */}

              {/* Puedes añadir más rutas específicas del admin aquí (ej: logs, configuraciones globales) */}

            </Route> {/* Fin de rutas bajo PlatformAdminLayout */}


            {/* Ruta para páginas no encontradas (Catch-all) */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;