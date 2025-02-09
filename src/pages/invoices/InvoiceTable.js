// src/pages/invoices/InvoiceTable.js
import { DataGrid } from '@mui/x-data-grid';
import { Card, IconButton, Tooltip, Chip } from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility,
  FileDownload 
} from '@mui/icons-material';

export const InvoiceTable = ({ invoices = [], onEdit, onDelete, onPreview, onDownload }) => {
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
          <Chip
            label={status === 'paid' ? 'Pagada' : status === 'pending' ? 'Pendiente' : 'Borrador'}
            color={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'default'}
            size="small"
          />
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
    <Card sx={{ width: '100%', minHeight: 400 }}>
      <DataGrid
        rows={processedRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
        disableSelectionOnClick
        loading={invoices.length === 0}
        components={{
          NoRowsOverlay: () => (
            <div style={{ padding: 20, textAlign: 'center' }}>
              No hay facturas disponibles
            </div>
          )
        }}
      />
    </Card>
  );
};

export default InvoiceTable;
