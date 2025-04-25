// src/pages/clients/ClientTable.js (CORREGIDO)
import React, { useState, useMemo } from 'react';
import {
  Box,
  Tooltip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper
} from '@mui/material';
import {
  Edit,
  Delete,
  Search as SearchIcon
} from '@mui/icons-material';
import ActionButton from '../../components/ActionButton'; // Importamos ActionButton

// Componente interno para acciones (actualizado)
const ClientActions = ({ client, onEdit, onDelete, isVisor = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
     {/* Reemplazamos IconButton por ActionButton para editar */}
     <ActionButton
       type="edit"
       onClick={() => onEdit && onEdit(client)}
       tooltipTitle="Editar cliente"
       isIconButton
       buttonProps={{
         size: "small",
         sx: { mr: 1 }
       }}
       showDisabled={isVisor} // Mostrar deshabilitado para visores
     >
       <Edit fontSize="inherit" />
     </ActionButton>
     
     {/* Reemplazamos IconButton por ActionButton para eliminar */}
     <ActionButton
       type="delete"
       onClick={() => onDelete && onDelete(client._id)}
       tooltipTitle="Eliminar cliente"
       isIconButton
       buttonProps={{
         size: "small"
       }}
       showDisabled={isVisor} // Mostrar deshabilitado para visores
     >
       <Delete fontSize="inherit" />
     </ActionButton>
  </Box>
);

// Asegúrate que la exportación coincida con cómo la importas en Clients.js
export const ClientTable = ({ clients = [], onEdit, onDelete, isVisor = false }) => {
  // Estado para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Lógica de filtrado
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Busca por nombre, RIF o email
    return clients.filter(client =>
      (client.nombre?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.rif?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.email?.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [clients, searchTerm]);

  // Handlers de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Barra de Búsqueda */}
      <Box sx={{ p: 2 }}>
         <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Buscar por Nombre, RIF o Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: ( <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> ),
            // Estilos oscuros (ajusta si es necesario)
            sx: { bgcolor: '#2a2a2a', borderRadius: '8px', color: 'rgba(255, 255, 255, 0.8)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)', }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)', }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', }, '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)', } }
          }}
        />
      </Box>

      {/* Tabla Refactorizada */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
        <Table size="small"> {/* Estilo compacto */}
          <TableHead>
             {/* Estilo cabecera oscura */}
            <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#333', color: 'white', fontWeight: 'bold' } }}>
              <TableCell>Nombre</TableCell>
              <TableCell>RIF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& .MuiTableCell-body': { color: 'rgba(255, 255, 255, 0.8)' } }}>
            {filteredClients.length === 0 ? (
              <TableRow>
                {/* Ajusta colSpan al número de columnas */}
                <TableCell colSpan={6} align="center" sx={{ borderBottom: 'none', color: 'rgba(255, 255, 255, 0.5)', py: 4 }}>
                  {searchTerm
                    ? `No se encontraron clientes para "${searchTerm}"`
                    : 'No hay clientes disponibles'
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client._id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{client.nombre || '—'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{client.rif || '—'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{client.email || '—'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{client.telefono || '—'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{client.direccion || '—'}</TableCell>
                    <TableCell align="right" sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
                       {/* Pasamos isVisor a ClientActions */}
                       <ClientActions 
                         client={client} 
                         onEdit={onEdit} 
                         onDelete={onDelete} 
                         isVisor={isVisor}
                       />
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredClients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        // Estilos para paginación en tema oscuro
        sx={{ color: 'rgba(255, 255, 255, 0.7)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e',
             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon': {
                color: 'inherit'
              }
        }}
      />
    </Box>
  );
};