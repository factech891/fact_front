import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Facturas from './Facturas';
import Clientes from './Clientes';
import Productos from './Productos';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    );
}

export default App;
