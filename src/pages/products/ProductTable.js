// src/pages/products/ProductTable.js - CON ESTILO NEGRO Y ENCABEZADOS EN NEGRITA
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

// Componentes estilizados para el tema oscuro
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
    backgroundColor: 'rgba(79, 172, 254, 0.08)', // Azul sutil al hover
  },
  '& .MuiTableCell-body': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.85)'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#121212', // Negro
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

// Helper para formatear moneda
const formatCurrency = (value, currencySymbol = 'Bs.') => {
  const number = Number(value) || 0;
  return `${currencySymbol} ${number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Componente para acciones
const ProductActions = ({ product, onEdit, onDelete, isVisor = false }) => (
  <Box display="flex" justifyContent="flex-end">
    <Tooltip title="Editar producto">
      <IconButton 
        size="small"
        onClick={() => onEdit && onEdit(product)}
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
    
    <Tooltip title="Eliminar producto">
      <IconButton 
        size="small"
        onClick={() => onDelete && onDelete(product._id)}
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
export const ProductTable = ({ products = [], onEdit, onDelete, loading, isVisor = false }) => {
  // Estado para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Lógica de filtrado
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(product =>
      (product.codigo?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (product.nombre?.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [products, searchTerm]);

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
          placeholder="Buscar por Código o Nombre..."
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
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={5} 
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
                      Cargando productos...
                    </Box>
                  ) : (
                    searchTerm ? 
                      `No se encontraron productos para "${searchTerm}"` : 
                      'No hay productos disponibles'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <StyledTableRow key={product._id}>
                    <TableCell sx={{ fontWeight: 500 }}>{product.codigo || '—'}</TableCell>
                    <TableCell>{product.nombre || '—'}</TableCell>
                    <TableCell align="right">{formatCurrency(product.precio)}</TableCell>
                    <TableCell align="right">{product.stock || 0}</TableCell>
                    <TableCell align="right">
                      <ProductActions 
                        product={product} 
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
      {filteredProducts.length > 0 && (
        <TablePagination
          component="div"
          count={filteredProducts.length}
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

export default ProductTable;