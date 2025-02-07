// src/pages/products/ProductTable.js
import { DataGrid } from '@mui/x-data-grid';
import { Card, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export const ProductTable = ({ products = [], onEdit, onDelete }) => {
  const columns = [
    { 
      field: 'codigo',
      headerName: 'Código',
      flex: 1
    },
    { 
      field: 'nombre',
      headerName: 'Nombre',
      flex: 1.5
    },
    {
      field: 'precio',
      headerName: 'Precio',
      flex: 1,
      type: 'number',
      valueFormatter: (params) => {
        const value = params.value || 0;
        return `$${Number(value).toFixed(2)}`;
      }
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
      type: 'number',
      valueFormatter: (params) => {
        return params.value || '0';
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(params.row)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => onDelete(params.row._id)} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // Asegurarnos de que los datos tengan el formato correcto
  const rows = products.map(product => ({
    id: product._id,
    _id: product._id,
    codigo: product.codigo || '',
    nombre: product.nombre || '',
    precio: Number(product.precio) || 0,
    stock: Number(product.stock) || 0,
    descripcion: product.descripcion || ''
  }));

  return (
    <Card sx={{ width: '100%', height: 'auto', minHeight: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 }
          }
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Card>
  );
};