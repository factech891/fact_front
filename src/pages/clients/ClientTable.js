// src/pages/clients/ClientTable.js - VERSIÓN CON TABLA NEGRA Y ENCABEZADOS EN NEGRITA
import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Paper,
  styled,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Componentes estilizados para el tema personalizado
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    color: theme.palette.common.white,
    fontWeight: 800, // Más negrita
    fontSize: '0.95rem',
    border: 'none',
    whiteSpace: 'nowrap',
    padding: '14px 16px'
  },
  '& .MuiTableCell-head:first-of-type': {
    borderTopLeftRadius: '8px'
  },
  '& .MuiTableCell-head:last-of-type': {
    borderTopRightRadius: '8px'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#161616', // Fila impar más oscura
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#1a1a1a', // Fila par ligeramente menos oscura
  },
  '&:hover': {
    backgroundColor: 'rgba(79, 172, 254, 0.08)', // Azul sutil al pasar el mouse
  },
  '& .MuiTableCell-body': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.85)'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#121212', // Muy oscuro/negro
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', // Sombra más pronunciada
}));

const SearchBar = styled(Box)(({ theme }) => ({
  marginBottom: '24px',
  padding: '10px 16px',
  borderRadius: '8px',
  backgroundColor: '#1e1e1e',
  border: '1px solid rgba(255, 255, 255, 0.05)'
}));

// Componente para acciones
const ClientActions = ({ client, onEdit, onDelete, isVisor = false }) => (
  <Box display="flex" justifyContent="flex-end">
    <Tooltip title="Editar cliente">
      <IconButton 
        size="small"
        onClick={() => onEdit && onEdit(client)}
        disabled={isVisor}
        sx={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover': { 
            color: '#4facfe',
            backgroundColor: 'rgba(79, 172, 254, 0.1)'
          },
          marginRight: 1
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    
    <Tooltip title="Eliminar cliente">
      <IconButton 
        size="small"
        onClick={() => onDelete && onDelete(client._id)}
        disabled={isVisor}
        sx={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover': { 
            color: '#ff4b2b',
            backgroundColor: 'rgba(255, 75, 43, 0.1)'
          }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

// Componente principal de la tabla
export const ClientTable = ({ clients = [], onEdit, onDelete, loading, isVisor = false }) => {
  // Estado para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Lógica de filtrado
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return clients.filter(client =>
      (client.nombre?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.rif?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.email?.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [clients, searchTerm]);

  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra de búsqueda mejorada */}
      <SearchBar>
        <TextField
          fullWidth
          placeholder="Buscar por Nombre, RIF o Email..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
            sx: { color: 'white', fontSize: '0.95rem' }
          }}
        />
      </SearchBar>

      {/* Tabla mejorada con MUI - NEGRA */}
      <StyledTableContainer 
        component={Paper} 
        sx={{ 
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.3s'
        }}
      >
        <Table size="medium">
          <StyledTableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>RIF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  align="center" 
                  sx={{ 
                    py: 5, 
                    color: 'rgba(255, 255, 255, 0.5)',
                    border: 'none',
                    backgroundColor: '#121212'
                  }}
                >
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <CircularProgress size={24} sx={{ color: '#4facfe', mr: 2 }} />
                      Cargando clientes...
                    </Box>
                  ) : (
                    searchTerm ? 
                      `No se encontraron clientes para "${searchTerm}"` : 
                      'No hay clientes disponibles'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <StyledTableRow key={client._id}>
                    <TableCell sx={{ fontWeight: 500 }}>{client.nombre || '—'}</TableCell>
                    <TableCell>{client.rif || '—'}</TableCell>
                    <TableCell>{client.email || '—'}</TableCell>
                    <TableCell>{client.telefono || '—'}</TableCell>
                    <TableCell>{client.direccion || '—'}</TableCell>
                    <TableCell align="right">
                      <ClientActions 
                        client={client} 
                        onEdit={onEdit} 
                        onDelete={onDelete} 
                        isVisor={isVisor}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Paginación personalizada con fondo negro */}
      {filteredClients.length > 0 && (
        <TablePagination
          component="div"
          count={filteredClients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: '#161616',
            borderRadius: '0 0 8px 8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            '.MuiTablePagination-toolbar': {
              padding: '12px',
              paddingLeft: '16px',
              paddingRight: '8px'
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            '.MuiTablePagination-select': {
              color: 'white'
            },
            '.MuiTablePagination-selectIcon': {
              color: 'rgba(255, 255, 255, 0.5)'
            },
            '.MuiIconButton-root': {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            '.MuiIconButton-root.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        />
      )}
    </Box>
  );
};

export default ClientTable;