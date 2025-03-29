import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DocumentStatusChip from './components/DocumentStatusChip';
import DocumentActions from './components/DocumentActions';
import { DOCUMENT_TYPE_NAMES } from './constants/documentTypes';

// Helper function for sorting
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function DocumentTable({ documents, onDelete, onSend }) {
  const navigate = useNavigate();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle edit document
  const handleEdit = (id) => {
    navigate(`/documents/edit/${id}`);
  };

  // Handle preview document
  const handlePreview = (id) => {
    navigate(`/documents/view/${id}`);
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter((doc) => {
    const searchString = searchTerm.toLowerCase();
    return (
      doc.documentNumber?.toLowerCase().includes(searchString) ||
      doc.client?.name?.toLowerCase().includes(searchString) ||
      DOCUMENT_TYPE_NAMES[doc.type]?.toLowerCase().includes(searchString) ||
      doc.client?.taxId?.toLowerCase().includes(searchString)
    );
  });

  // Sort and paginate
  const sortedDocuments = filteredDocuments
    .sort(getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'documentNumber'}
                    direction={orderBy === 'documentNumber' ? order : 'asc'}
                    onClick={() => handleRequestSort('documentNumber')}
                  >
                    Número
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => handleRequestSort('type')}
                  >
                    Tipo
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'client.name'}
                    direction={orderBy === 'client.name' ? order : 'asc'}
                    onClick={() => handleRequestSort('client.name')}
                  >
                    Cliente
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'createdAt'}
                    direction={orderBy === 'createdAt' ? order : 'asc'}
                    onClick={() => handleRequestSort('createdAt')}
                  >
                    Fecha
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'total'}
                    direction={orderBy === 'total' ? order : 'asc'}
                    onClick={() => handleRequestSort('total')}
                  >
                    Total
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    Estado
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDocuments.map((document) => (
                <TableRow hover key={document._id}>
                  <TableCell>{document.documentNumber || '-'}</TableCell>
                  <TableCell>{DOCUMENT_TYPE_NAMES[document.type]}</TableCell>
                  <TableCell>{document.client?.name}</TableCell>
                  <TableCell>
                    {document.createdAt ? format(new Date(document.createdAt), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: document.currency || 'EUR'
                    }).format(document.total || 0)}
                  </TableCell>
                  <TableCell>
                    <DocumentStatusChip status={document.status} />
                  </TableCell>
                  <TableCell align="right">
                    <DocumentActions 
                      document={document} 
                      onEdit={() => handleEdit(document._id)}
                      onPreview={() => handlePreview(document._id)}
                      onDelete={() => onDelete(document._id)}
                      onSend={() => onSend(document._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {sortedDocuments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron documentos
                  </TableCell>
                </TableRow>
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
      </Paper>
    </Box>
  );
}

export default DocumentTable;