// src/pages/invoices/InvoiceTable.js (CORREGIDO - Usa InvoiceActions Importado)
import React, { useState, useMemo } from 'react';
import {
  Box,
  IconButton, // IconButton puede ser necesario si InvoiceActions lo usa internamente o para otros botones
  Tooltip,    // Tooltip puede ser necesario
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
  MenuItem
} from '@mui/material';
import {
  // Edit, Delete, Visibility, FileDownload, // Ya no se importan aquí directamente
  Search as SearchIcon
} from '@mui/icons-material';
// Importar el componente InvoiceActions CORRECTO (el que tiene permisos)
// VERIFICA ESTA RUTA: Debe apuntar a src/pages/invoices/components/InvoiceActions.js
import InvoiceActions from './components/InvoiceActions';

// ============================================================
// ===== ¡IMPORTANTE! ASEGÚRATE DE BORRAR ESTA DEFINICIÓN =====
// const InvoiceActions = ({ invoice, onPreview, onDownload, onEdit, onDelete }) => {
//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//       <Tooltip title="Previsualizar"><IconButton onClick={() => onPreview && onPreview(invoice)} size="small"><Visibility fontSize="inherit" /></IconButton></Tooltip>
//       <Tooltip title="Descargar PDF"><IconButton onClick={() => onDownload && onDownload(invoice)} size="small"><FileDownload fontSize="inherit" /></IconButton></Tooltip>
//       <Tooltip title="Editar"><IconButton onClick={() => onEdit && onEdit(invoice)} size="small"><Edit fontSize="inherit" /></IconButton></Tooltip>
//       <Tooltip title="Eliminar"><IconButton onClick={() => onDelete && onDelete(invoice._id)} size="small"><Delete fontSize="inherit" /></IconButton></Tooltip>
//     </Box>
//   );
// };
// ============================================================

export const InvoiceTable = ({ invoices = [], onEdit, onDelete, onPreview, onDownload, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusMenu, setStatusMenu] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Funciones auxiliares (sin cambios)
  const getStatusLabel = (status) => { switch (status?.toLowerCase()) { case 'draft': return 'Borrador'; case 'pending': return 'Pendiente'; case 'paid': return 'Pagada'; case 'cancelled': return 'Anulada'; case 'overdue': return 'Vencida'; case 'partial': return 'Pago Parcial'; default: return 'Borrador'; } };
  const getStatusColorForMenu = (status) => { switch (status?.toLowerCase()) { case 'draft': return 'default'; case 'pending': return 'warning'; case 'paid': return 'success'; case 'cancelled': return 'error'; case 'overdue': return 'error'; case 'partial': return 'info'; default: return 'default'; } };
  const getStatusColorSx = (status) => { switch (status?.toLowerCase()) { case 'draft': return { borderColor: 'grey.500', color: 'grey.700' }; case 'pending': return { borderColor: 'warning.main', color: 'warning.dark' }; case 'paid': return { borderColor: 'success.main', color: 'success.dark' }; case 'cancelled': return { borderColor: 'error.main', color: 'error.dark' }; case 'overdue': return { borderColor: 'error.main', color: 'error.dark' }; case 'partial': return { borderColor: 'info.main', color: 'info.dark' }; default: return { borderColor: 'grey.500', color: 'grey.700' }; } };
  const formatDisplayDate = (dateString) => { if (!dateString) return '—'; try { if (dateString.includes('T')) { const d = new Date(dateString); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; } const parts = dateString.split('-'); if (parts.length === 3) { return `${parts[2]}/${parts[1]}/${parts[0]}`; } return dateString; } catch (e) { console.error('Error formateando fecha:', e); return dateString || '—'; } };
  const formatCurrency = (amount, currency = 'VES') => { if (amount === undefined || amount === null) return '—'; return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency }).format(amount); };

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

  // Menú de estado (sin cambios)
  const handleStatusClick = (event, invoice) => {
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
      {/* Búsqueda (sin cambios) */}
      <Box sx={{ p: 2 }}>
         <TextField fullWidth size="small" variant="outlined" placeholder="Buscar por Nº Factura, Cliente o Estado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> ), sx: { bgcolor: '#2a2a2a', borderRadius: '8px', color: 'rgba(255, 255, 255, 0.8)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)', }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)', }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', }, '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)', } } }} />
      </Box>

      {/* Tabla (sin cambios en estructura, solo en la celda de acciones) */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#333', color: 'white', fontWeight: 'bold' } }}>
              <TableCell>N° Factura</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& .MuiTableCell-body': { color: 'rgba(255, 255, 255, 0.8)' } }}>
            {filteredInvoices.length === 0 ? ( <TableRow> <TableCell colSpan={6} align="center" sx={{ borderBottom: 'none', color: 'rgba(255, 255, 255, 0.5)', py: 4 }}> {searchTerm ? `No se encontraron facturas que coincidan con "${searchTerm}"` : 'No hay facturas disponibles' } </TableCell> </TableRow> ) : (
              filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <TableRow key={invoice._id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{invoice.number || 'N/A'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{formatDisplayDate(invoice.date)}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{invoice.client?.nombre || 'N/A'}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>{formatCurrency(invoice.total, invoice.moneda)}</TableCell>
                    <TableCell sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <Chip
                        label={getStatusLabel(invoice.status)}
                        size="small"
                        variant="outlined"
                        onClick={(e) => handleStatusClick(e, invoice)}
                        sx={{
                          cursor: 'pointer',
                          ...getStatusColorSx(invoice.status),
                          fontWeight: 'medium'
                         }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
                      {/* USAR EL InvoiceActions IMPORTADO (el que tiene permisos) */}
                      <InvoiceActions
                        invoice={invoice}
                        onPreview={onPreview}
                        onDownload={onDownload}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación (sin cambios) */}
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredInvoices.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Filas por página" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} sx={{ color: 'rgba(255, 255, 255, 0.7)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon': { color: 'inherit' } }} />

      {/* Menú de estado (sin cambios) */}
      <Menu
        anchorEl={statusMenu}
        open={Boolean(statusMenu)}
        onClose={handleStatusClose}
      >
        {['draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled'].map((status) => (
          <MenuItem key={status} onClick={() => handleStatusChange(status)}>
            <Chip
                label={getStatusLabel(status)}
                size="small"
                color={getStatusColorForMenu(status)}
                sx={{ minWidth: '100px', fontWeight: 'medium' }}
             />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
