// src/pages/documents/DocumentTable.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Search as SearchIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS, DOCUMENT_STATUS_NAMES, DOCUMENT_STATUS_COLORS } from './constants/documentTypes';

const DocumentTable = ({ documents = [], onDelete, onConvert }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar documentos según el término de búsqueda
  const filteredDocuments = documents.filter(doc => {
    const term = searchTerm.toLowerCase();
    return (
      doc.documentNumber?.toLowerCase().includes(term) ||
      doc.client?.name?.toLowerCase().includes(term) ||
      DOCUMENT_TYPE_NAMES[doc.type]?.toLowerCase().includes(term) ||
      DOCUMENT_STATUS_NAMES[doc.status]?.toLowerCase().includes(term)
    );
  });

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar clic en editar
  const handleEdit = (id) => {
    navigate(`/documents/edit/${id}`);
  };

  // Manejar clic en ver
  const handleView = (id) => {
    navigate(`/documents/view/${id}`);
  };

  // Formatear fecha para mostrar en tabla
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '—';
    try {
      // Si es una fecha en formato ISO
      if (dateString.includes('T')) {
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      }
      
      // Si ya está en formato YYYY-MM-DD
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      
      return dateString;
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return dateString || '—';
    }
  };

  // Formatear moneda
  const formatCurrency = (amount, currency = 'EUR') => {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Box>
      {/* Buscador */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron documentos
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((document) => (
                  <TableRow key={document._id} hover>
                    <TableCell>{document.documentNumber || '—'}</TableCell>
                    <TableCell>{DOCUMENT_TYPE_NAMES[document.type]}</TableCell>
                    <TableCell>
                      {document.client ? (
                        document.client.nombre || document.client.name || '—'
                      ) : '—'}
                    </TableCell>
                    <TableCell>{formatDisplayDate(document.date)}</TableCell>
                    <TableCell>
                      {formatCurrency(document.total, document.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={DOCUMENT_STATUS_NAMES[document.status]} 
                        color={DOCUMENT_STATUS_COLORS[document.status]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver">
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(document._id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(document._id)}
                          disabled={document.status === DOCUMENT_STATUS.CONVERTED}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {document.status !== DOCUMENT_STATUS.CONVERTED && (
                        <Tooltip title="Convertir a Factura">
                          <IconButton 
                            size="small" 
                            onClick={() => onConvert && onConvert(document._id)}
                            color="primary"
                          >
                            <ConvertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete && onDelete(document._id)}
                          disabled={document.status === DOCUMENT_STATUS.CONVERTED}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
        count={filteredDocuments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

export default DocumentTable;