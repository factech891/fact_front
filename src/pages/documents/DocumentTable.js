// src/pages/documents/DocumentTable.js
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
  Divider
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS, DOCUMENT_STATUS_NAMES, DOCUMENT_STATUS_COLORS } from './constants/documentTypes';
import DocumentActions from './components/DocumentActions';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import { convertToInvoice } from '../../services/DocumentsApi'; // Asegúrate que la importación es correcta

const DocumentTable = ({ documents = [], onDelete, onConvert, onRefresh }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  // MODIFICADO: Acepta 'invoiceDataFromModal'
  const handleConvertToInvoice = async (invoiceDataFromModal) => {
    // Obtenemos el ID del documento original desde los datos pasados
    const documentId = invoiceDataFromModal.originalDocument;
    if (!documentId) {
        console.error("No se encontró el ID del documento original en los datos del modal.");
        alert("Error: No se pudo identificar el documento original.");
        return;
    }

    try {
      console.log("Convirtiendo documento a factura:", documentId, "con datos:", invoiceDataFromModal);

      // MODIFICADO: Llamar al API con el ID y los datos del modal
      await convertToInvoice(documentId, invoiceDataFromModal);

      // Mostrar mensaje de éxito
      alert("Documento convertido a factura correctamente");

      // Recargar la tabla
      handleRefresh();
    } catch (error) {
      console.error("Error al convertir documento:", error);
      alert("Error al convertir documento a factura: " + (error.message || ""));
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
      <Box>
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
                    {searchTerm
                      ? 'No se encontraron documentos que coincidan con la búsqueda'
                      : 'No hay documentos disponibles'
                    }
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
                        <DocumentActions
                          document={document}
                          onPreview={() => handleView(document._id)}
                          onDelete={() => onDelete && onDelete(document._id)}
                          // onDownloadPdf eliminado
                          // MODIFICADO: Pasar la referencia directa a la función
                          onConvertToInvoice={handleConvertToInvoice}
                          onRefresh={handleRefresh}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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

      <DocumentPreviewModal
        open={previewDocument !== null}
        onClose={() => setPreviewDocument(null)}
        documentId={previewDocument}
        onRefresh={handleRefresh}
      />
    </>
  );
};

export default DocumentTable;