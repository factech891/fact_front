import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Invoices from './components/Invoices/Invoices';
import Clients from './components/Clients/Clients';
import Products from './components/Products/Products';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="*" element={<h1>Page Not Found</h1>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
