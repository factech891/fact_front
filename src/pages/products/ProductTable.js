// src/pages/products/ProductTable.js - REFACTORIZADO CON <Table> ESTÁNDAR Y BÚSQUEDA
import React, { useState, useMemo } from 'react';
import {
  Box,
  IconButton,
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
  Paper, // Usamos Paper
  CircularProgress // Para el estado de carga opcional
} from '@mui/material';
import {
  Edit,
  Delete,
  Search as SearchIcon
} from '@mui/icons-material';
// Quitamos import de DataGrid y Card

// Helper para formatear moneda (existente en tu código)
const formatCurrency = (value, currencySymbol = 'Bs.') => {
  const number = Number(value) || 0;
  // Puedes ajustar opciones de formato si necesitas, ej: es-VE
  return `${currencySymbol} ${number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Componente interno para acciones
const ProductActions = ({ product, onEdit, onDelete }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
     <Tooltip title="Editar">
       {/* Quitamos color="primary" */}
       <IconButton onClick={() => onEdit && onEdit(product)} size="small">
         <Edit fontSize="inherit" />
       </IconButton>
     </Tooltip>
     <Tooltip title="Eliminar">
       {/* Quitamos color="error" */}
       <IconButton onClick={() => onDelete && onDelete(product._id)} size="small">
         <Delete fontSize="inherit" />
       </IconButton>
     </Tooltip>
  </Box>
);

// Exportación consistente (nombrada en este caso)
export const ProductTable = ({ products = [], onEdit, onDelete, loading }) => {
  // Estado para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Lógica de filtrado por código o nombre
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(product =>
      (product.codigo?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (product.nombre?.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [products, searchTerm]);

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
          placeholder="Buscar por Código o Nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: ( <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> ),
            // Estilos oscuros
            sx: { bgcolor: '#2a2a2a', borderRadius: '8px', color: 'rgba(255, 255, 255, 0.8)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)', }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)', }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', }, '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)', } }
          }}
        />
      </Box>

      {/* Tabla Refactorizada */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#333', color: 'white', fontWeight: 'bold' } }}>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& .MuiTableCell-body': { color: 'rgba(255, 255, 255, 0.8)' } }}>
            {/* Indicador de carga si loading es true y no hay datos filtrados aún */}
            {loading && filteredProducts.length === 0 && !searchTerm ? (
               <TableRow>
                 <TableCell colSpan={5} align="center" sx={{ borderBottom: 'none', py: 4 }}>
                   <CircularProgress size={24} />
                 </TableCell>
               </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ borderBottom: 'none', color: 'rgba(255, 255, 255, 0.5)', py: 4 }}>
                  {searchTerm
                    ? `No se encontraron productos para "${searchTerm}"`
                    : 'No hay productos disponibles'
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product._id || product.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{product.codigo || '—'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{product.nombre || '—'}</TableCell>
                    <TableCell align="right" sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{formatCurrency(product.precio)}</TableCell>
                    <TableCell align="right" sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{product.stock ?? 0}</TableCell>
                    <TableCell align="right" sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
                       <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
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
        count={filteredProducts.length}
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

