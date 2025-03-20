// src/pages/invoices/InvoiceTable.js
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Chip, Menu, MenuItem } from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility,
  FileDownload 
} from '@mui/icons-material';

export const InvoiceTable = ({ invoices = [], onEdit, onDelete, onPreview, onDownload, onStatusChange }) => {
  const [statusMenu, setStatusMenu] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleStatusClick = (event, invoice) => {
    event.stopPropagation(); // Prevenir que se seleccione la fila
    setStatusMenu(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleStatusClose = () => {
    setStatusMenu(null);
    setSelectedInvoice(null);
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange && selectedInvoice) {
      onStatusChange(selectedInvoice._id, newStatus);
    }
    handleStatusClose();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagada';
      case 'cancelled':
        return 'Anulada';
      case 'overdue':
        return 'Vencida';
      case 'partial':
        return 'Pago Parcial';
      default:
        return 'Borrador';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'overdue':
        return 'error';
      case 'partial':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns = [
    { 
      field: 'number', 
      headerName: 'N° Factura', 
      flex: 1 
    },
    { 
      field: 'date', 
      headerName: 'Fecha',
      flex: 1,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
      }
    },
    { 
      field: 'clientName',
      headerName: 'Cliente',
      flex: 1.5,
      renderCell: (params) => {
        return params.row?.client?.nombre || 'N/A';
      }
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      renderCell: (params) => {
        const currency = params.row?.moneda || 'USD';
        const total = params.row?.total || 0;
        return `${currency} ${total.toFixed(2)}`;
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params) => {
        const status = params.value || 'draft';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={getStatusLabel(status)}
              color={getStatusColor(status)}
              size="small"
              sx={{ mr: 1, cursor: 'pointer' }}
              onClick={(e) => handleStatusClick(e, params.row)}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Previsualizar">
            <IconButton 
              onClick={() => {
                console.log('Datos a enviar a preview:', params.row);
                onPreview(params.row);
              }} 
              color="info" 
              size="small"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar PDF">
            <IconButton 
              onClick={() => onDownload && onDownload(params.row)} 
              color="secondary" 
              size="small"
            >
              <FileDownload fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton 
              onClick={() => onEdit && onEdit(params.row)} 
              color="primary" 
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton 
              onClick={() => onDelete && onDelete(params.row._id)} 
              color="error" 
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // Procesar rows con datos seguros
  const processedRows = invoices.map(invoice => ({
    id: invoice._id || `temp-${Math.random()}`,
    number: invoice.number || 'Sin número',
    date: invoice.date || new Date(),
    clientName: invoice.client?.nombre || 'N/A',
    total: invoice.total || 0,
    status: invoice.status || 'draft',
    moneda: invoice.moneda || 'USD',
    client: invoice.client || {},
    _id: invoice._id,
    // Agregar los items y otros campos necesarios
    items: invoice.items || [],
    subtotal: invoice.subtotal || 0,
    tax: invoice.tax || 0
  }));

  return (
    <>
      <DataGrid
        rows={processedRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25, 100]}
        autoHeight
        disableSelectionOnClick
        loading={invoices.length === 0}
        components={{
          NoRowsOverlay: () => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
              <Box>No hay facturas disponibles</Box>
            </Box>
          )
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f9f9f9',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0'
          }
        }}
      />

      <Menu
        anchorEl={statusMenu}
        open={Boolean(statusMenu)}
        onClose={handleStatusClose}
      >
        <MenuItem onClick={() => handleStatusChange('draft')}>
          <Chip label="Borrador" size="small" color="default" sx={{ minWidth: '80px' }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('pending')}>
          <Chip label="Pendiente" size="small" color="warning" sx={{ minWidth: '80px' }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('paid')}>
          <Chip label="Pagada" size="small" color="success" sx={{ minWidth: '80px' }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('partial')}>
          <Chip label="Pago Parcial" size="small" color="info" sx={{ minWidth: '80px' }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('overdue')}>
          <Chip label="Vencida" size="small" color="error" sx={{ minWidth: '80px' }} />
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>
          <Chip label="Anulada" size="small" color="error" sx={{ minWidth: '80px' }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default InvoiceTable;