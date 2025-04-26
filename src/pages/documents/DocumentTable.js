// src/pages/documents/DocumentTable.js - VERSIÓN MEJORADA CON ESTILO NEGRO Y COLORES ORIGINALES
import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS, DOCUMENT_STATUS_NAMES, DOCUMENT_STATUS_COLORS } from './constants/documentTypes';
import DocumentActions from './components/DocumentActions';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import { convertToInvoice } from '../../services/DocumentsApi';

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

const DocumentTable = ({ documents = [], onDelete, onConvert, onRefresh, onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Filtrar documentos según el término de búsqueda
  const filteredDocuments = documents.filter(doc => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      (doc.documentNumber?.toLowerCase().includes(term)) ||
      (doc.client?.nombre?.toLowerCase().includes(term) ||
       doc.client?.name?.toLowerCase().includes(term)) ||
      (DOCUMENT_TYPE_NAMES[doc.type]?.toLowerCase().includes(term)) ||
      (DOCUMENT_STATUS_NAMES[doc.status]?.toLowerCase().includes(term))
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

  // Manejar clic en ver
  const handleView = (id) => {
    setPreviewDocument(id);
  };

  // Función para recargar los datos
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };

  // Función para cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Conversión a factura
  const handleConvertToInvoice = async (invoiceDataFromModal) => {
    const documentId = invoiceDataFromModal.originalDocument;
    if (!documentId) {
        console.error("No se encontró el ID del documento original en los datos del modal.");
        setSnackbar({
          open: true,
          message: "Error: No se pudo identificar el documento original.",
          severity: "error"
        });
        return;
    }

    try {
      console.log("Convirtiendo documento a factura:", documentId, "con datos:", invoiceDataFromModal);
      await convertToInvoice(documentId, invoiceDataFromModal);
      setSnackbar({
        open: true,
        message: "Documento convertido a factura correctamente",
        severity: "success"
      });
      handleRefresh();
    } catch (error) {
      console.error("Error al convertir documento:", error);
      setSnackbar({
        open: true,
        message: "Error al convertir documento a factura: " + (error.message || ""),
        severity: "error"
      });
    }
  };

  // Formatear fecha para mostrar en tabla
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '—';
    try {
      if (dateString.includes('T')) {
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      }
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
  const formatCurrency = (amount, currency = 'VES') => {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  useEffect(() => {
    // Este efecto se ejecutará cuando refreshKey cambie
  }, [refreshKey]);

  useEffect(() => {
    if (previewDocument === null) {
       // handleRefresh(); // Comentado temporalmente si causa bucles
    }
  }, [previewDocument]);

  return (
    <>
      {/* Buscador con estilo unificado */}
      <SearchBar>
        <TextField
          fullWidth
          placeholder="Buscar por número, cliente, tipo o estado..."
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
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={7} 
                  align="center" 
                  sx={{ 
                    py: 5, 
                    color: 'rgba(255, 255, 255, 0.5)',
                    border: 'none',
                    backgroundColor: '#121212'
                  }}
                >
                  {searchTerm ? (
                    'No se encontraron documentos que coincidan con la búsqueda'
                  ) : (
                    'No hay documentos disponibles'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((document) => (
                  <StyledTableRow key={document._id}>
                    <TableCell sx={{ fontWeight: 500 }}>{document.documentNumber || '—'}</TableCell>
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
                      {/* Chip con los colores originales pero mejor visibilidad */}
                      <Chip
                        label={DOCUMENT_STATUS_NAMES[document.status]}
                        color={DOCUMENT_STATUS_COLORS[document.status]}
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: 500,
                          '& .MuiChip-label': {
                            // Asegurar contraste adecuado del texto según el color de fondo
                            color: document.status === 'draft' ? 'rgba(0, 0, 0, 0.87)' : 'white'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <DocumentActions
                        document={document}
                        onPreview={() => handleView(document._id)}
                        onDelete={() => onDelete && onDelete(document._id)}
                        onEdit={() => onEdit && onEdit(document._id)}
                        onConvertToInvoice={handleConvertToInvoice}
                        onRefresh={handleRefresh}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Paginación personalizada */}
      {filteredDocuments.length > 0 && (
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredDocuments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}

      {/* Modal de vista previa (sin cambios) */}
      <DocumentPreviewModal
        open={previewDocument !== null}
        onClose={() => setPreviewDocument(null)}
        documentId={previewDocument}
        onRefresh={handleRefresh}
      />

      {/* Snackbar estilizado */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            ...(snackbar.severity === 'success' && {
              backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
              '& .MuiAlert-icon': { color: 'white' },
              color: 'white'
            })
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentTable;