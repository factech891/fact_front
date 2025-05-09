// src/pages/invoices/InvoiceTable.js - VERSIÓN MEJORADA CON ESTILO NEGRO Y CONTROL DE ROL
import React, { useState, useMemo, useContext } from 'react'; // Importar useContext
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Menu,
  MenuItem,
  styled
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import InvoiceActions from './components/InvoiceActions';
import AuthContext from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta
import { formatDate } from '../../utils/dateUtils'; // 1. Agregar importación de utilidades de fecha

// Componentes estilizados para el tema oscuro (sin cambios)
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

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
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
}));

export const InvoiceTable = ({ invoices = [], onEdit, onDelete, onPreview, onDownload, onStatusChange }) => {
  // --- MODIFICACIÓN: Obtener usuario completo del contexto ---
  const { hasRole, currentUser } = useContext(AuthContext);
  // Determinar si el usuario actual es visor
  const isViewer = hasRole('visor');
  // Obtener la zona horaria del usuario
  const userTimezone = currentUser?.timezone;
  // --- FIN MODIFICACIÓN ---

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusMenu, setStatusMenu] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Funciones auxiliares (sin cambios)
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'Borrador';
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagada';
      case 'cancelled': return 'Anulada';
      case 'overdue': return 'Vencida';
      case 'partial': return 'Pago Parcial';
      default: return 'Borrador';
    }
  };

  const getStatusColorForMenu = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'default';
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'cancelled': return 'error';
      case 'overdue': return 'error';
      case 'partial': return 'info';
      default: return 'default';
    }
  };

  const getStatusColorSx = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return { borderColor: 'grey.500', color: 'grey.700' };
      case 'pending': return { borderColor: 'warning.main', color: 'warning.dark' };
      case 'paid': return { borderColor: 'success.main', color: 'success.dark' };
      case 'cancelled': return { borderColor: 'error.main', color: 'error.dark' };
      case 'overdue': return { borderColor: 'error.main', color: 'error.dark' };
      case 'partial': return { borderColor: 'info.main', color: 'info.dark' };
      default: return { borderColor: 'grey.500', color: 'grey.700' };
    }
  };

  // Función para obtener el color de fondo del chip según el estado
  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'rgba(158, 158, 158, 0.15)'; // Gris
      case 'pending': return 'rgba(255, 152, 0, 0.15)'; // Naranja/Amarillo
      case 'paid': return 'rgba(76, 175, 80, 0.15)'; // Verde
      case 'cancelled': return 'rgba(244, 67, 54, 0.15)'; // Rojo
      case 'overdue': return 'rgba(244, 67, 54, 0.15)'; // Rojo
      case 'partial': return 'rgba(33, 150, 243, 0.15)'; // Azul
      default: return 'rgba(158, 158, 158, 0.15)'; // Gris
    }
  };

  // Modificar la función formatDisplayDate para usar nuestras utilidades
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '—';
    try {
      // Usar nuestra utilidad formatDate que maneja zonas horarias
      return formatDate(dateString, 'dd/MM/yyyy', userTimezone);
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return dateString || '—';
    }
  };

  const formatCurrency = (amount, currency = 'VES') => {
    if (amount === undefined || amount === null) return '—';
    // Asegurarse que amount es un número antes de formatear
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return 'Inválido';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency }).format(numericAmount);
  };

  // Filtrado (sin cambios)
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    if (!searchTerm) return invoices;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return invoices.filter(invoice =>
      (invoice.number?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (invoice.client?.nombre?.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (getStatusLabel(invoice.status).toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [invoices, searchTerm]);

  // Paginación (sin cambios)
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Menú de estado
  const handleStatusClick = (event, invoice) => {
    // --- MODIFICACIÓN: No abrir menú si es visor ---
    if (isViewer) return;
    // --- FIN MODIFICACIÓN ---
    event.stopPropagation();
    setStatusMenu(event.currentTarget);
    setSelectedInvoice(invoice);
  };
  const handleStatusClose = () => {
    setStatusMenu(null);
  };
  const handleStatusChange = (newStatus) => {
    const invoiceId = selectedInvoice?._id;
    if (onStatusChange && invoiceId) {
      onStatusChange(invoiceId, newStatus);
    }
    handleStatusClose();
  };

  return (
    <Box>
      {/* Buscador con estilo unificado */}
      <SearchBar>
        <TextField
          fullWidth
          placeholder="Buscar por Nº Factura, Cliente o Estado..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Tabla con estilo negro */}
      <StyledTableContainer component={Paper}>
        <Table size="medium">
          <StyledTableHead>
            <TableRow>
              <TableCell>N° Factura</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right" sx={{ width: '120px' }}>Acciones</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredInvoices.length === 0 ? (
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
                  {searchTerm ?
                    `No se encontraron facturas que coincidan con "${searchTerm}"` :
                    'No hay facturas disponibles'
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <StyledTableRow key={invoice._id}>
                    <TableCell sx={{ fontWeight: 500 }}>{invoice.number || 'N/A'}</TableCell>
                    <TableCell>{formatDisplayDate(invoice.date)}</TableCell>
                    <TableCell>{invoice.client?.nombre || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(invoice.total, invoice.moneda)}</TableCell>
                    <TableCell>
                      {/* --- MODIFICACIÓN: Chip de estado --- */}
                      <Chip
                        label={getStatusLabel(invoice.status)}
                        size="small"
                        // Solo permitir click si NO es visor
                        onClick={!isViewer ? (e) => handleStatusClick(e, invoice) : undefined}
                        sx={{
                          // Cambiar cursor si es visor para indicar que no es clickeable
                          cursor: isViewer ? 'default' : 'pointer',
                          borderRadius: '16px',
                          fontWeight: 500,
                          backgroundColor: getStatusBgColor(invoice.status),
                          color: getStatusColorSx(invoice.status).color,
                          borderColor: getStatusColorSx(invoice.status).borderColor,
                          border: '1px solid',
                          // Mantener hover solo si NO es visor
                          ...(!isViewer && {
                            '&:hover': {
                              backgroundColor: getStatusBgColor(invoice.status),
                              opacity: 0.9
                            }
                          })
                        }}
                      />
                      {/* --- FIN MODIFICACIÓN --- */}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ width: '120px' }}
                    >
                      <InvoiceActions
                        invoice={invoice}
                        onPreview={onPreview}
                        onDownload={onDownload}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        // Pasar isViewer a InvoiceActions si también necesita deshabilitar acciones allí
                        isViewer={isViewer}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Paginación personalizada */}
      {filteredInvoices.length > 0 && (
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}

      {/* Menú de estado para cambiar estado (no se abrirá si es visor) */}
      <Menu
        anchorEl={statusMenu}
        open={Boolean(statusMenu)}
        onClose={handleStatusClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2a2a2a',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        {['draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled'].map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            <Chip
              label={getStatusLabel(status)}
              size="small"
              color={getStatusColorForMenu(status)}
              sx={{
                minWidth: '100px',
                fontWeight: 'medium',
                backgroundColor: getStatusBgColor(status),
                color: getStatusColorSx(status).color,
                borderColor: getStatusColorSx(status).borderColor,
                border: '1px solid'
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};